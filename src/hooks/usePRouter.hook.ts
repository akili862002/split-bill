"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNProgress } from "./useNProgress.hook";

export const usePRouter = (searchParams?: any) => {
  const pathname = usePathname();
  const nprogress = useNProgress();

  useEffect(() => {
    nprogress.done();
  }, [pathname, searchParams]);

  const router = useRouter();

  const { push } = router;

  router.push = (href, options) => {
    nprogress.start();
    push(href, options);
  };

  return router;
};
