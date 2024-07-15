"use client";

import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
} from "react";
import {
  FieldSize,
  FormControl,
  getBaseFieldClassName,
  getFormControlProps,
  IFormControlProps,
} from "../FormControl";
import { isFunction } from "formik";
import { cn } from "@/utils/cn.util";

export type IInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export type IBaseTextFieldChildrenArgs = {
  isError?: boolean;
};

export type IBaseTextFieldProps = IFormControlProps & {
  value?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  type?: "text" | "number" | "password";
  size?: FieldSize;
  inputProps?: Omit<
    IInputProps,
    "type" | "defaultValue" | "placeholder" | "className" | "ref"
  >;
  leftSide?: ReactNode;
  // rightSide?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  active?: boolean;
  /**
   * Use
   */
  children?: ReactNode | ((args: IBaseTextFieldChildrenArgs) => ReactNode);
  /**
   * use onChangeValue instead of onChange, since Formik will overwrite the onChange
   */
  onChangeValue?: (value: string, setValue: (val: string) => void) => void;
  validate?: (value: string | undefined) => string | undefined | null;

  /** use trick to set value for formik */
  setValue?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

export interface IBaseTextFieldRef {
  getValue: () => string;
  setValue: (val: string) => void;
  focus: () => void;
  blur: () => void;
}

export const BaseTextFieldComponent = forwardRef<
  IBaseTextFieldRef,
  IBaseTextFieldProps
>(
  (
    {
      className = "",
      value,
      inputClassName = "",
      children = null,
      leftSide = null,
      iconLeft = null,
      iconRight = null,
      placeholder,
      type = "text",
      autoFocus = false,
      active = false,
      size,

      inputProps = {},

      onChangeValue,
      validate,
      setValue,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const error = validate?.(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => inputRef.current.value,
        setValue: (val) => {
          handleSetValue(val);
          onChangeValue?.(val, handleSetValue);
        },
        focus: () => inputRef.current.focus(),
        blur: () => inputRef.current.blur(),
      }),
      [inputRef]
    );

    const handleSetValue = (val: string) => {
      inputRef.current.value = val;
      setValue?.(val);
    };

    return (
      <FormControl {...getFormControlProps(props)} className={className}>
        <div className="relative flex w-full">
          {leftSide && <div className="flex-shrink-0 h-full">{leftSide}</div>}
          {iconLeft && (
            <div className="left-2 max-w-[24px] absolute center-children move-center-y">
              {iconLeft}
            </div>
          )}
          {iconRight && (
            <div className="right-2 center-children max-w-[24px] absolute move-center-y">
              {iconRight}
            </div>
          )}
          <input
            ref={inputRef}
            value={value}
            type={type}
            placeholder={placeholder}
            className={cn(
              getBaseFieldClassName({ isError: !!error, active, size }),
              iconLeft && "pl-7",
              leftSide && "rounded-l-none",
              inputClassName
            )}
            autoFocus={autoFocus}
            {...inputProps}
            onBlur={(e) => {
              onBlur?.();
              inputProps?.onBlur?.(e);
            }}
            onFocus={(e) => {
              onFocus?.();
              inputProps?.onFocus?.(e);
            }}
            onChange={(e) => {
              onChangeValue?.(e.target.value, handleSetValue);
              inputProps?.onChange?.(e);
            }}
            disabled={props.disabled}
          />
          {isFunction(children) ? children({ isError: !!error }) : children}
        </div>
      </FormControl>
    );
  }
);

export const BaseTextField = memo(BaseTextFieldComponent);
