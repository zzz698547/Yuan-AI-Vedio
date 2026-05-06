import { TenantShell } from "@/components/app-shell/tenant-shell";
import { TenantAnalyticsClient } from "@/components/tenant-analytics/tenant-analytics-client";

export default function TenantAnalyticsPage() {
  return (
    <TenantShell>
      <TenantAnalyticsClient />
    </TenantShell>
  );
}
