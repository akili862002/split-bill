import { cn, cnx } from "@/utils/cn.util";
import { IFormControlProps } from "./FormControl";

export type FieldSize = "sm" | "md" | "lg";

export const getBaseFieldClassName = (args: {
  isError?: boolean;
  active?: boolean;
  size?: FieldSize;
}) => {
  args.size = args.size || "md";

  return cnx(
    "base-field w-full px-2 border border-neutral-200 rounded-lg  placeholder:font-medium text-sm truncate disabled:bg-neutral-200 disabled:cursor-default",
    {
      "h-7": args.size === "sm",
      "h-8": args.size === "md",
      "h-9": args.size === "lg",
    },
    args.isError ? " bg-red-50" : " bg-neutral-50",
    args.isError
      ? "placeholder-red-500 [&>.placeholder]:text-red-500"
      : " placeholder:text-neutral-400 [&>.placeholder]:text-neutral-400",
    " focus:ring-black focus:outline-none focus:border-black focus:ring-1",
    args.active && "ring-black ring-1 border-black",
    !!args.isError && "border-red-500"
  );
};

export const getFormControlProps = <T extends IFormControlProps>(args: T) => {
  return {
    className: args.className,
    name: args.name,
    label: args.label,
    subLabel: args.subLabel,
    required: args.required,
    disabled: args.disabled,
    isFloatError: args.isFloatError,
  };
};

export const listBoxStyle = {
  button: (
    open: boolean,
    isError: boolean | undefined,
    size: FieldSize = "md"
  ) =>
    cn(
      getBaseFieldClassName({ isError, active: open, size }),
      "group flex items-center cursor-pointer select-none relative focus:outline-none text-left pr-8"
    ),
  optionsContainerTransitions: () => ({
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform-none opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-95",
  }),
  optionContainer: (additionalClassName?: string | string[]) =>
    cn(
      "bg-white p-1 text-sm font-medium max-h-[360px] overflow-y-auto text-neutral-800 z-40 shadow-md border absolute mt-1 w-full rounded-xl outline-none",
      additionalClassName
    ),

  option: (active: boolean, selected: boolean, additionalClassName = "") =>
    cnx(
      "px-3 w-full py-1.5 rounded-lg cursor-pointer relative text-left",
      active && "bg-neutral-100 active:bg-neutral-100",
      selected && "bg-neutral-100 active:bg-neutral-100",
      additionalClassName
    ),
};
