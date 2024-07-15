import { useField } from "formik";
import {
  BaseCheckboxGroup,
  IBaseCheckboxGroupProps,
} from "./BaseCheckboxGroup";

export interface ICheckboxGroupProps<T>
  extends Omit<IBaseCheckboxGroupProps<T>, "listOptionSelected" | "onChange"> {
  name: string;
  required: boolean;
  onChange?: (option: T[]) => void;
}
/**
 * @usage With Formik
 */
export const CheckboxGroup = <T,>(props: ICheckboxGroupProps<T>) => {
  const { name, onChange } = props;

  const [field, meta, helper] = useField<T[]>(name);

  const isError = !!meta.touched && !!meta.error;

  return (
    <>
      <BaseCheckboxGroup
        listOptionSelected={field.value}
        onChange={(options) => {
          helper.setValue(options);
          onChange?.(options);
        }}
        validate={() => (isError ? meta.error : "")}
        {...props}
      />
    </>
  );
};
