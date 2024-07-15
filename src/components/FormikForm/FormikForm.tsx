"use client";

import { cn } from "@/utils/cn.util";
import {
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps,
  isFunction,
} from "formik";
import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as yup from "yup";

export type IYupSchemaCallback<T> = (_yup: typeof yup) => {
  [key in keyof T]?: yup.Schema<
    T[key] extends string
      ? string
      : T[key] extends number
      ? number
      : T[key] extends any[]
      ? any[]
      : any
  >;
};

type IFieldProp<T> = {
  name: keyof T;
  required: boolean;
};

export type { FormikHelpers };

export type IFormFieldProps<T> = {
  fieldProps: Record<keyof T, IFieldProp<T>>;
};

export { useField, useFormikContext } from "formik";

export interface IFormikFormProps<T> {
  formId?: string;
  className?: string;
  initValues: T;
  children: React.FC<IFormFieldProps<T> & FormikProps<T>> | ReactNode;
  yupSchema?: IYupSchemaCallback<T>;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => Promise<void> | void;
}
export interface IFormikFormRef<T> {
  getValues: () => T;
  submit: () => void;
  reset: () => void;
  setInitValues: (values: T) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  getErrors: () => FormikErrors<T>;
}

const FormikFormInner = <T,>(
  {
    formId,
    className,
    initValues,
    children,
    yupSchema,
    onSubmit,
  }: IFormikFormProps<T>,
  ref: ForwardedRef<IFormikFormRef<T>>
) => {
  const validateSchema = useMemo(() => yupSchema?.(yup), [yupSchema]);
  const formikRef = useRef<FormikProps<T>>(null);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => formikRef.current.values,
      submit: formikRef.current.submitForm,
      setInitValues: formikRef.current.setValues,
      reset: formikRef.current.resetForm,
      setFieldValue: formikRef.current.setFieldValue as any,
      getErrors: () => formikRef.current.errors,
      setErrors: (errors) => {
        formikRef.current.setErrors({
          ...formikRef.current.errors,
          ...errors,
        });
      },
    }),
    [formikRef]
  );

  const generatePropsForFields = (): Record<keyof T, IFieldProp<T>> => {
    const object: Record<keyof T, IFieldProp<T>> = {} as any;

    for (let key in initValues) {
      object[key] = {
        name: key,
        required:
          validateSchema?.[key] !== undefined
            ? !(validateSchema?.[key] as any)?.spec.optional
            : false,
      };
    }

    return object;
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={initValues}
      validationSchema={yup.object().shape(validateSchema || {})}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form id={formId} className={cn("space-y-1.5", className)}>
          {isFunction(children)
            ? children?.({
                ...props,
                fieldProps: generatePropsForFields(),
              })
            : children}
        </Form>
      )}
    </Formik>
  );
};

export const FormikForm = forwardRef(FormikFormInner) as <T>(
  props: IFormikFormProps<T> & {
    ref?: ForwardedRef<IFormikFormRef<T>>;
  }
) => ReturnType<typeof FormikFormInner>;
