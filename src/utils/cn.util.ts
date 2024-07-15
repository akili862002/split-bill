import classnames from "classnames";
import { twMerge } from "tailwind-merge";

export const cn = (...args: any[]) => classnames(args);
export const cnx = (...args: any[]) => {
  return twMerge(cn(args));
};
