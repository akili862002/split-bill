import { cn } from "@/utils/cn.util";
import { PropsWithChildren } from "react";
import { Spinner } from "../Spinner";

interface IButtonProps {
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "black" | "outline";
}

export const Button: React.FC<PropsWithChildren<IButtonProps>> = ({
  type = "button",
  className,
  onClick,
  icon,
  disabled = false,
  loading,
  children,
  variant = "black",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "relative rounded-lg flex items-center gap-2 justify-center font-medium h-fit flex-shrink-0 min-h-8 px-4",
        {
          "bg-neutral-800 focus:bg-black text-white": variant === "black",
          "border text-black shadow-sm": variant === "outline",
        },
        className
      )}
    >
      <div
        className={cn(
          loading && "text-transparent",
          icon && "items-center gap-2 flex flex-row [&>svg]:icon-sm"
        )}
      >
        {icon}
        {children}
      </div>
      {loading && (
        <div className="absolute h-fit move-center">
          <Spinner size="md" />
        </div>
      )}
    </button>
  );
};
