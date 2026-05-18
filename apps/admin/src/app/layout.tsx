import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  icons: {
    icon: "/pahal-logo.jpeg",
    shortcut: "/pahal-logo.jpeg",
    apple: "/pahal-logo.jpeg",
  },
  title: {
    default: "Pahal Beauty Academy — Admin",
    template: "%s | Pahal Admin",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#a855f7" shadow="0 0 10px #a855f7,0 0 5px #9333ea" height={3} showSpinner={false} />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
