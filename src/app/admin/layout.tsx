import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/app-shell/admin-shell";

export const metadata: Metadata = {
  title: "Veltrix AI Admin",
  description: "Veltrix AI SaaS admin dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
