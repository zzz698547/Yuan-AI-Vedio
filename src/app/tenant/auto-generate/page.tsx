import { TenantShell } from "@/components/app-shell/tenant-shell";
import { AutoGenerateClient } from "@/components/tenant-auto-generate/auto-generate-client";

export default function TenantAutoGeneratePage() {
  return (
    <TenantShell>
      <AutoGenerateClient />
    </TenantShell>
  );
}
