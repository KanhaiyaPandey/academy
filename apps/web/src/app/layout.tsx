import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: {
    default: "Pahal Academy — Computer Learning & IT Courses",
    template: "%s | Pahal Academy",
  },
  description:
    "Pahal Academy offers industry-leading computer courses, programming bootcamps, and IT certifications. Start your tech career today in Ranchi, Jharkhand.",
  keywords: [
    "computer courses ranchi",
    "it courses jharkhand",
    "python programming",
    "web development course",
    "tally gst",
    "dca diploma",
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
