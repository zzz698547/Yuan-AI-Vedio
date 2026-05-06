import { TenantShell } from "@/components/app-shell/tenant-shell";
import { TenantNotificationsClient } from "@/components/tenant-notifications/tenant-notifications-client";

export default function TenantNotificationsPage() {
  return (
    <TenantShell>
      <TenantNotificationsClient />
    </TenantShell>
  );
}
