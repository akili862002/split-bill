import { FormControl, IFormControlProps } from "../FormControl";
import { ReactNode } from "react";
import { BaseCheckbox } from "../Checkbox/BaseCheckbox";
import React from "react";
import { cn } from "@/utils/cn.util";
import { has } from "@/utils/common.util";

export interface IBaseCheckboxGroupProps<T> extends IFormControlProps {
  loading?: boolean;
  className?: string;
  listOptionSelected: T[] | null | undefined;
  listContainerClassName?: string;
  options: T[];
  hideOptions?: T[];
  onChange: (option: T[]) => void;
  renderOption: (args: { option: T; checked: boolean }) => ReactNode;
  validate?: () => string;
  isEqual: (a: T, b: T) => boolean;
}

export const BaseCheckboxGroup = <T,>({
  className,
  listOptionSelected = [],
  listContainerClassName,
  options,
  hideOptions = [],
  onChange,
  renderOption,
  isEqual,
  validate,
  loading,
  ...formControlProps
}: IBaseCheckboxGroupProps<T>) => {
  const handleChangeOption = (option: T, checked: boolean) => {
    if (checked) {
      console.log([...listOptionSelected, option]);

      onChange([...listOptionSelected, option]);
    } else {
      onChange(listOptionSelected.filter((item) => !isEqual(item, option)));
    }
  };

  return (
    <FormControl className={className} {...formControlProps}>
      <div
        className={cn("flex flex-col pl-0.5 space-y-2", listContainerClassName)}
      >
        {!loading ? (
          options.map((option, index) => {
            if (has(hideOptions, option, isEqual)) return null;
            const checked = has(listOptionSelected, option, isEqual);
            return (
              <BaseCheckbox
                key={index}
                checked={checked}
                onChange={(checked) => handleChangeOption(option, checked)}
                label={renderOption({ option, checked })}
              />
            );
          })
        ) : (
          <div className="space-y-1">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}
      </div>
    </FormControl>
  );
};

const Skeleton: React.FC = (props) => {
  return (
    <div className="flex h-2.5">
      <div className="w-3 mr-1 bg-gray-100 rounded-lg"></div>
      <div className="w-full bg-gray-100 rounded-lg"></div>
    </div>
  );
};
