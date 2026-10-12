import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Open Numeric Admin",
  },
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardLayout>{children}</DashboardLayout>
    </RequireAuth>
  );
}