import { cn } from "@/utils/cn.util";
import { isFunction, useField } from "formik";

interface IWithFormHelperProps {
  name: string;
  className?: string | ((isError: boolean) => string);
  children: React.ReactNode | ((isError: boolean) => React.ReactNode);
}

export const WithFormHelper: React.FC<IWithFormHelperProps> = ({
  name,
  className,
  children,
}) => {
  const [field, meta] = useField(name);
  const isError =
    !!meta.touched && !!meta.error && typeof meta.error === "string";
  console.log("Error:", meta.error);

  return (
    <div
      className={cn(
        isError && "text-red-600",
        isFunction(className) ? className(isError) : className
      )}
    >
      {isFunction(children) ? children(isError) : children}
    </div>
  );
};
