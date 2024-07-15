import { useField } from "formik";
import {
  BaseNumericFormat,
  IBaseNumericFormatProps,
} from "./BaseNumericFormat";
import { PropsWithChildren } from "react";

export interface INumericFormatProps
  extends Omit<
    IBaseNumericFormatProps,
    "ref" | "onChange" | "value" | "onChangeValue"
  > {
  name: string;
  required: boolean;
  onChangeValue?: (value: number) => void;
}

export const NumericFormat: React.FC<
  PropsWithChildren<INumericFormatProps>
> = ({ onChangeValue, ...props }) => {
  const [field, meta, helper] = useField(props.name);
  const isError = !!meta.touched && !!meta.error;

  return (
    <>
      <BaseNumericFormat
        value={field.value}
        validate={() => isError && meta.error}
        onChangeValue={(val) => {
          helper.setValue(val);
          onChangeValue?.(val);
        }}
        {...props}
      />
    </>
  );
};
