import type { ReactNode } from "react";

import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

type TenantShellProps = {
  children: ReactNode;
};

export function TenantShell({ children }: TenantShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        mode="tenant"
        className="fixed inset-y-0 left-0 z-50 hidden lg:flex"
      />
      <div className="min-h-screen min-w-0 lg:pl-[260px]">
        <Topbar mode="tenant" />
        <main className="dashboard-page mx-auto w-full max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
