import { TenantShell } from "@/components/app-shell/tenant-shell";
import { TenantDashboardClient } from "@/components/tenant-dashboard/tenant-dashboard-client";

export default function TenantDashboardPage() {
  return (
    <TenantShell>
      <TenantDashboardClient />
    </TenantShell>
  );
}
