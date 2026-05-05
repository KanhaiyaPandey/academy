import { AdminLayout } from "@/components/layout/AdminLayout";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
