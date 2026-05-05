import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    default: "Pahal Beauty Academy — Admin",
    template: "%s | Pahal Admin",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#ec4899" shadow="0 0 10px #ec4899,0 0 5px #db2777" height={3} showSpinner={false} />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
