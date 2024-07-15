import { useField } from "formik";
import { ReactNode } from "react";
import { BaseCheckbox, IBaseCheckboxProps } from "./BaseCheckbox";

export interface ICheckboxProps
  extends Omit<IBaseCheckboxProps, "checked" | "validate" | "onChange"> {
  name: string;
  label: ReactNode;
  required?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<ICheckboxProps> = ({
  name,
  onChange,
  ...rest
}) => {
  const [fields, meta, helper] = useField<boolean>(name);
  const isError = !!meta?.error && !!meta.touched;

  return (
    <BaseCheckbox
      checked={fields.value || false}
      onChange={checked => {
        helper.setValue(checked);
        onChange?.(checked);
      }}
      isError={isError}
      {...rest}
    />
  );
};
