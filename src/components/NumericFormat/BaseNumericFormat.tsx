import { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/utils/cn.util";
import {
  FieldSize,
  FormControl,
  IFormControlProps,
  getBaseFieldClassName,
  getFormControlProps,
} from "../FormControl";
import {
  InputAttributes,
  NumericFormatProps,
  NumericFormat as _NumericFormat,
} from "react-number-format";

export type IBaseNumericFormatProps = IFormControlProps &
  Omit<NumericFormatProps<InputAttributes>, "size"> & {
    size?: FieldSize;
    value: number;
    iconLeft?: ReactNode;
    inputClassName?: string;
    onChangeValue: (value: number) => void;
    validate?: (value: number) => string | undefined;
  };

export const BaseNumericFormat: React.FC<
  PropsWithChildren<IBaseNumericFormatProps>
> = ({
  size,
  className,
  value,
  inputClassName,
  iconLeft = null,
  required,
  onChangeValue,
  validate,
  children,
  ...rest
}) => {
  const error = validate?.(value);

  return (
    <FormControl
      {...getFormControlProps(rest)}
      className={className}
      required={required}
    >
      <div className="relative flex w-full">
        {iconLeft && (
          <div className="left-2 max-w-[20px] absolute center-children move-center-y text-gray-500">
            {iconLeft}
          </div>
        )}
        <_NumericFormat
          value={value}
          className={cn(
            getBaseFieldClassName({ size, isError: !!error }),
            iconLeft && "pl-7",
            inputClassName
          )}
          thousandSeparator=","
          decimalSeparator="."
          {...rest}
          onValueChange={({ floatValue }) => {
            onChangeValue(floatValue ?? 0);
          }}
        />
        {children}
      </div>
    </FormControl>
  );
};
