import { useField } from "formik";
import {
  BaseSelectDefaultStyle,
  IBaseSelectDefaultStyleProps,
} from "./BaseSelectDefaultStyle";

interface ISelectDefaultStyleProps
  extends Omit<IBaseSelectDefaultStyleProps, "value" | "onChange"> {
  name: string;
  onChange?: (val: string) => void;
}

export const SelectDefaultStyle: React.FC<ISelectDefaultStyleProps> = (
  props
) => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <BaseSelectDefaultStyle
      {...props}
      value={field.value}
      isError={meta.touched && !!meta.error}
      onChange={(val) => {
        helpers.setValue(val);
        props?.onChange(val);
      }}
    />
  );
};
