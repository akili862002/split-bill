import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ChiaBill - Công bằng, minh bạch chính xác",
  description: "App này dùng để chia chi phí sau mỗi lần đi chơi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon32.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <script>const global = globalThis;</script>
      </head>
      <body>
        <NextTopLoader showSpinner={false} color="#2f2f2f" height={4} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
