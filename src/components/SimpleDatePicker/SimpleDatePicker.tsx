import { useField } from "formik";
import {
  BaseSimpleDatePicker,
  IBaseSimpleDatePickerProps,
} from "./BaseSimpleDatePicker";

export interface ISimpleDatePickerProps
  extends Omit<IBaseSimpleDatePickerProps, "value" | "onChange"> {
  name: string;
  required: boolean;
}

export const SimpleDatePicker: React.FC<ISimpleDatePickerProps> = props => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <BaseSimpleDatePicker
      value={field.value}
      onChange={helpers.setValue}
      validate={() => meta.touched && meta.error}
      {...props}
    />
  );
};
