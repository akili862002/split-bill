import { UpDownIcon } from "@/icons/common.icons";
import {
  FormControl,
  IFormControlProps,
  getFormControlProps,
  listBoxStyle,
} from "../FormControl";
import { Spinner } from "../Spinner";
import { cn } from "@/utils/cn.util";

type ISelectDefaultStyleOption = {
  label: string;
  value: string;
};

export interface IBaseSelectDefaultStyleProps extends IFormControlProps {
  className?: string;
  value: string | null;
  placeholder?: string;
  options: ISelectDefaultStyleOption[];
  onChange: (val: string) => void;
  loading?: boolean;
  isError?: boolean;
}

export const BaseSelectDefaultStyle: React.FC<IBaseSelectDefaultStyleProps> = ({
  className,
  value,
  options,
  loading = false,
  isError,
  placeholder,
  onChange,
  ...rest
}) => {
  return (
    <FormControl {...getFormControlProps(rest)}>
      <div className="relative">
        <select
          disabled={loading}
          className={cn(
            "appearance-none",
            className,
            listBoxStyle.button(false, isError),
            !value && "!text-gray-400"
          )}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option selected disabled value="">
            {placeholder || "select one"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {loading && (
          <div className="absolute icon-sm move-center-y right-8">
            <Spinner />
          </div>
        )}
        <UpDownIcon className="absolute opacity-50 pointer-events-none icon-sm move-center-y right-2" />
      </div>
    </FormControl>
  );
};
