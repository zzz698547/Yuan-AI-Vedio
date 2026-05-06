import { TenantShell } from "@/components/app-shell/tenant-shell";
import { ManualSocialBindClient } from "@/components/tenant-social/manual-social-bind-client";

export default function TenantSocialAccountsPage() {
  return (
    <TenantShell>
      <ManualSocialBindClient />
    </TenantShell>
  );
}
