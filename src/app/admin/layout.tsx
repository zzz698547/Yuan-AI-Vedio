import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/app-shell/admin-shell";

export const metadata: Metadata = {
  title: "AI Video Platform Admin",
  description: "AI video SaaS admin dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
