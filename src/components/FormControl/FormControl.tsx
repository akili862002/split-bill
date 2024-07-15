"use client";

import { PropsWithChildren } from "react";
import { useField } from "formik";
import { cn } from "@/utils/cn.util";

export interface IFormControlProps {
  name?: string;
  label?: string | null;
  subLabel?: string | null;
  className?: string;
  labelClassName?: string;
  required?: boolean | undefined;
  disabled?: boolean;
  labelRightSide?: React.ReactNode;
  isFloatError?: boolean;
}

export const FormControl = ({
  name = "",
  label,
  labelClassName = "",
  className = "",
  subLabel = "",
  required,
  disabled = false,
  labelRightSide,
  isFloatError = false,
  children,
}: PropsWithChildren<IFormControlProps>) => {
  let [_, meta] = [
    null,
    {
      touched: false,
      error: "",
    },
  ] as any;
  if (name) [_, meta] = useField(name);

  const isError: boolean =
    !!meta.touched && !!meta.error && typeof meta.error === "string";

  return (
    <div
      className={cn(
        "font-medium relative block w-full",
        isError
          ? "text-red-500 [&>.base-field]:border-red-500 [&>.base-field]:bg-red-50"
          : "text-gray-900 [&>.sub-label]:text-gray-500",
        disabled && "pointer-events-none opacity-70 select-none",
        className
      )}
      data-required={required}
      data-label={label}
      data-name={name}
      data-disable={disabled}
    >
      {label && (
        <div className="flex items-center justify-between">
          <label
            className={cn(
              "text-[13px] block font-medium",
              !subLabel && "mb-0.5",
              labelClassName
            )}
          >
            {label}
            {!required && (
              <span
                className={cn(
                  "text-gray-500 text-xs ml-1",
                  isError && "text-red-500"
                )}
              >
                (không bắt buộc)
              </span>
            )}
          </label>
          {labelRightSide}
        </div>
      )}
      {subLabel && (
        <div className="sub-label mb-1.5 text-xs font-normal leading-4">
          {subLabel}
        </div>
      )}
      {children}
      {isError && (
        <FormControl.Error isFloat={isFloatError} errorMessage={meta.error} />
      )}
    </div>
  );
};

FormControl.Error = ({
  errorMessage,
  isFloat,
}: {
  errorMessage: string;
  isFloat: boolean;
}) => {
  if (!errorMessage) return null;
  if (isFloat) return null;
  return <span className="text-xs pl-0.5 text-red-500">{errorMessage}</span>;
};
