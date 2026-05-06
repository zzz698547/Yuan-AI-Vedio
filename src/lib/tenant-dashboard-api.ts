import { cachedApiGet } from "@/lib/api-cache";
import type { TenantDashboardData } from "@/types/tenant-dashboard";

const TENANT_DASHBOARD_CACHE_KEY = "tenant-dashboard";

export function getTenantDashboardApi(tenantId?: string) {
  const search = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
  const cacheKey = `${TENANT_DASHBOARD_CACHE_KEY}:${tenantId ?? "default"}`;

  return cachedApiGet<TenantDashboardData>(
    cacheKey,
    `/api/tenant/dashboard${search}`,
    10_000
  );
}
