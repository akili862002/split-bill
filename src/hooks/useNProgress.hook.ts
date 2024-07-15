import * as NProgress from "nprogress";

export const useNProgress = () => {
  return {
    start: () => NProgress.start(),
    done: () => NProgress.done(),
  };
};
