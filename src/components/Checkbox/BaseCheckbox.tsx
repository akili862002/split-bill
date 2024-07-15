import { cn } from "@/utils/cn.util";
import React, { ReactNode } from "react";

export interface IBaseCheckboxProps {
  checked: boolean;
  className?: string;
  label?: ReactNode;
  subLabel?: string;
  labelClassName?: string;
  isError?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BaseCheckbox: React.FC<IBaseCheckboxProps> = ({
  checked,
  className,
  label,
  subLabel,
  labelClassName,
  isError,
  disabled = false,
  onChange,
}) => {
  return (
    <label
      className={cn(
        "flex space-x-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <input
        type="checkbox"
        value=""
        checked={checked}
        className={cn(
          "flex-shrink-0 mt-[2px] disabled:border-gray-100",
          isError &&
            "!border-red-600 !bg-red-100 checked:!bg-red-600 checked:!border-red-600"
        )}
        onChange={(e) => onChange(!checked, e)}
        disabled={disabled}
      />
      {label && (
        <div
          className={cn(
            "font-medium select-none text-sm",
            labelClassName,
            disabled && "!text-gray-500",
            isError ? "text-red-600" : "text-gray-900"
          )}
        >
          <div>{label}</div>
          {subLabel && (
            <div className="text-xs font-normal text-gray-600">{subLabel}</div>
          )}
        </div>
      )}
    </label>
  );
};
