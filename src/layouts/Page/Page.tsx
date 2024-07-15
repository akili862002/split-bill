"use client";

import { PropsWithChildren, ReactNode, useEffect } from "react";
import * as NProgress from "nprogress";
import { cn } from "@/utils/cn.util";
import Link from "next/link";
import { LeftArrowIcon } from "./Page.icons";
import { Button } from "@/components/Button";
import { paths } from "@/utils/paths.util";

type ActionButton = {
  content: string;
  url?: string;
};

interface IPageProps {
  size?: "sm" | "md" | "full";
  title: ReactNode;
  titleMetadata?: ReactNode;
  subtitle?: ReactNode;
  backLink?: string;
  primaryAction?: ActionButton;
  loading?: boolean | string;
  containerClassName?: string;
}

export const Page = (props: PropsWithChildren<IPageProps>) => {
  const {
    size = "md",
    title,
    subtitle,
    backLink,
    loading,
    containerClassName,
    titleMetadata,
    children,
    primaryAction,
  } = props;

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return (
    <div className="relative flex flex-col items-center w-full px-6 py-10">
      <div
        className={cn("w-full", {
          "max-w-none": size === "full",
          "max-w-5xl": size === "md",
          "max-w-2xl": size === "sm",
        })}
      >
        <header className="flex justify-between w-full gap-2">
          {backLink && (
            <Link
              href={backLink}
              className="flex-shrink-0 p-1 mr-1 rounded-lg w-fit h-fit hover:bg-neutral-200"
            >
              <LeftArrowIcon className="icon-md" />
            </Link>
          )}
          <div className="flex-1">
            <div className="flex">
              <h1 className="text-xl font-bold">{title}</h1>
              <span className="mt-1 ml-2">{titleMetadata}</span>
            </div>
            {subtitle && (
              <p className="mt-1 text-xs font-medium whitespace-pre-wrap text-neutral-600">
                {subtitle}
              </p>
            )}
          </div>
          {primaryAction && (
            <Link href={primaryAction.url}>
              <Button variant="black">{primaryAction.content}</Button>
            </Link>
          )}
        </header>
        <div className={cn("mt-10 space-y-4", containerClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

type IPageSectionProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
  actions?: {
    content: string;
    url?: string;
    onAction?: () => void;
  }[];
};

Page.Section = ({
  children,
  className,
  title,
  subtitle,
  noPadding,
  actions = [],
}: PropsWithChildren<IPageSectionProps>) => {
  return (
    <section
      className={cn(
        "py-4 bg-white h-fit rounded-xl border-gray-300 shadow-card",
        noPadding ? "px-0" : "px-4",
        className
      )}
    >
      {title && (
        <div
          className={cn(
            "flex justify-between w-full mb-3",
            noPadding && "px-4"
          )}
        >
          <div className="flex-1">
            <h5 className="font-semibold">{title}</h5>
            {subtitle && (
              <p className="text-gray-700 text-[13px]">{subtitle}</p>
            )}
          </div>
          <div className="flex gap-3">
            {actions.map((action, index) =>
              action ? (
                action?.url ? (
                  <Link
                    key={index}
                    href={action.url}
                    className="text-[13px] h-fit font-medium text-blue-700 hover:underline"
                  >
                    {action.content}
                  </Link>
                ) : (
                  <div
                    role="button"
                    key={index}
                    className="text-[13px] h-fit font-medium text-blue-700 hover:underline"
                    onClick={action.onAction}
                  >
                    {action.content}
                  </div>
                )
              ) : null
            )}
          </div>
        </div>
      )}
      <div className="w-full space-y-4">{children}</div>
    </section>
  );
};

export const PageSection = Page.Section;

Page.SectionBlock = ({
  title,
  children,
  actions,
}: PropsWithChildren<{
  title: string;
  actions?: {
    content: string;
    url?: string;
    onAction?: () => void;
  }[];
}>) => {
  return (
    <div className="mt-2 first:mt-0">
      <div className="flex justify-between">
        <h5 className="font-semibold">{title}</h5>
        <div className="flex gap-3">
          {actions?.map((action, index) =>
            action ? (
              action.url ? (
                <Link
                  href={action.url}
                  className="text-[13px], h-fit font-medium text-blue-700 hover:underline"
                >
                  {action.content}
                </Link>
              ) : (
                <div
                  role="button"
                  key={index}
                  className="text-[13px] h-fit font-medium text-blue-700 hover:underline"
                  onClick={action.onAction}
                >
                  {action.content}
                </div>
              )
            ) : null
          )}
        </div>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
};

Page.Grid = ({
  className,
  left,
  right,
}: {
  className?: string;
  left: ReactNode;
  right: ReactNode;
}) => {
  return (
    <div className={cn("grid grid-cols-[2fr,1fr] gap-4 w-full", className)}>
      <div className="space-y-4">{left}</div>
      <div className="space-y-4">{right}</div>
    </div>
  );
};

export const PageGrid = Page.Grid;
