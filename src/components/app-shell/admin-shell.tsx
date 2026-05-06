import type { ReactNode } from "react";

import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        mode="admin"
        className="fixed inset-y-0 left-0 z-50 hidden lg:flex"
      />
      <div className="min-h-screen min-w-0 lg:pl-[260px]">
        <Topbar mode="admin" />
        <main className="dashboard-page mx-auto w-full max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
