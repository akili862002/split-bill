"use client";

import { useField } from "formik";
import { useCallback, useMemo } from "react";
import { memo } from "react";
import { BaseTextField, IBaseTextFieldProps } from "./BaseTextField";

export interface ITextFieldProps
  extends Omit<IBaseTextFieldProps, "onChange" | "ref"> {
  name: string;
  required: boolean;
}

const TextFieldInner: React.FC<ITextFieldProps> = props => {
  const [field, meta] = useField(props.name);
  const isError = !!meta.touched && !!meta.error;

  const handleValidate = useCallback(() => {
    return isError && meta.error;
  }, [isError]);

  const inputProps = useMemo(() => {
    return {
      ...props?.inputProps,
      ...field,
    };
  }, [props?.inputProps, field]);

  return (
    <BaseTextField
      validate={handleValidate}
      inputProps={inputProps}
      {...props}
    />
  );
};

export const TextField = memo(TextFieldInner);
