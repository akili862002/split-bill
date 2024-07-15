import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const utilsPlugin = plugin(function ({ addBase, addComponents, theme }) {
  addComponents({
    ".icon-lg": {
      width: "40px",
      height: "40px",
    },
    ".icon-md": {
      width: "24px",
      height: "24px",
    },
    ".icon-sm": {
      width: "20px",
      height: "20px",
    },
    ".icon-xs": {
      width: "16px",
      height: "16px",
    },
    ".move-center-x": {
      left: "50%",
      transform: "translateX(-50%)",
    },
    ".move-center-y": {
      top: "50%",
      transform: "translateY(-50%)",
    },
    ".move-center": {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
  });
});

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.05),0 4px 6px rgba(34,42,53,0.04),0 24px 68px rgba(47,48,55,0.05),0 2px 3px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [utilsPlugin],
};
export default config;
