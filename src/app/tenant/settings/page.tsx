import { TenantShell } from "@/components/app-shell/tenant-shell";
import { TenantAiModelsClient } from "@/components/tenant-ai-models/tenant-ai-models-client";

export default function TenantSettingsPage() {
  return (
    <TenantShell>
      <TenantAiModelsClient />
    </TenantShell>
  );
}
