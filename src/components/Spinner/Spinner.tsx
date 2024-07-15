import { cn } from "@/utils/cn.util";
import React from "react";
import { SVGProps } from "react";

export interface ISpinnerProps extends SVGProps<SVGSVGElement> {
  /**
   * Size of SVG
   * Use number or common size\
   * sm: 16\
   * md: 24\
   * lg: 30
   */
  size?: "sm" | "md" | "lg" | number;
  strokeWidth?: number;
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 30,
};

export const Spinner: React.FC<ISpinnerProps> = ({
  className = "",
  size = "md",
  strokeWidth = 5,
  ...rest
}) => {
  size = typeof size === "string" ? sizes[size] : size;

  return (
    <div
      className={cn("relative center-children", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        className="spinner"
        viewBox="0 0 50 50"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          margin: `-${size / 2}px 0 0 -${size / 2}`,
        }}
        {...rest}
      >
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
        ></circle>
      </svg>
    </div>
  );
};
