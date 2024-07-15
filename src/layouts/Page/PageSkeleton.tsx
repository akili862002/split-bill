import { Skeleton } from "@dakoli/core";
import { Page } from "./Page";
import { useEffect } from "react";
import * as NProgress from "nprogress";

interface IPageSkeletonProps {}

export const PageSkeleton: React.FC<IPageSkeletonProps> = props => {
  useEffect(() => {
    NProgress.start();
  }, []);

  return (
    <Page title={<Skeleton className="w-20 h-8" />}>
      <Page.Grid
        left={
          <>
            <Page.Section title="">
              <Skeleton className="w-1/3 h-5 mb-6" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-1/2 h-3 my-1" />
            </Page.Section>
            <Page.Section title="">
              <Skeleton className="w-1/3 h-5 mb-6" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-1/2 h-3 my-1" />
            </Page.Section>
          </>
        }
        right={
          <Page.Section title="">
            <Skeleton className="w-full h-3 my-1" />
            <Skeleton className="w-full h-3 my-1" />
            <Skeleton className="w-full h-3 my-1" />
            <Skeleton className="w-full h-3 my-1" />
            <Skeleton className="w-1/2 h-3 my-1" />

            <div className="pt-10">
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-full h-3 my-1" />
              <Skeleton className="w-1/2 h-3 my-1" />
            </div>
          </Page.Section>
        }
      />
    </Page>
  );
};
