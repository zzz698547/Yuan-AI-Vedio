import { TenantShell } from "@/components/app-shell/tenant-shell";
import { RoutePlaceholderPage } from "@/components/empty-state/route-placeholder";
import { tenantRoutePlaceholders } from "@/data/route-placeholders";

export default function TenantBrandPage() {
  return (
    <TenantShell>
      <RoutePlaceholderPage page={tenantRoutePlaceholders.brand} />
    </TenantShell>
  );
}
