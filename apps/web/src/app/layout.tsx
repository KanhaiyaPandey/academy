import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: {
    default: "Pahal Academy — Beauty & Cosmetology Courses",
    template: "%s | Pahal Academy",
  },
  description:
    "Pahal Academy offers professional beauty courses in makeup artistry, hair styling, skincare, nail art, and bridal makeup. Start your beauty career in Ranchi, Jharkhand.",
  keywords: [
    "beauty courses ranchi",
    "makeup artistry jharkhand",
    "hair styling course",
    "skincare course",
    "nail art course",
    "bridal makeup course",
    "cosmetology diploma",
    "pahal academy",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AntdRegistry>
      </body>
    </html>
  );
}
