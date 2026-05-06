import {
  cachedApiGet,
  invalidateApiCache,
  setApiCache,
} from "@/lib/api-cache";
import { parseApiResponse } from "@/lib/api-response";
import type {
  TenantPlan,
  TenantRecord,
  TenantStatus,
} from "@/types/tenant-management";

export const TENANTS_CACHE_KEY = "admin:tenants";

export type CreateTenantPayload = {
  name: string;
  contact: string;
  username: string;
  password: string;
  nickname: string;
  plan: TenantPlan;
};

export async function fetchTenants() {
  return cachedApiGet<TenantRecord[]>(TENANTS_CACHE_KEY, "/api/tenants", 15_000);
}

export async function createTenantApi(payload: CreateTenantPayload) {
  const response = await fetch("/api/tenants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await parseApiResponse<TenantRecord>(response);
  invalidateApiCache(TENANTS_CACHE_KEY);
  return result;
}

export async function updateTenantApi(
  tenantId: string,
  payload: Partial<Pick<TenantRecord, "name" | "contact" | "expiredAt">> & {
    status?: TenantStatus;
  }
) {
  const response = await fetch(`/api/tenants/${tenantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await parseApiResponse<TenantRecord>(response);
  invalidateApiCache(TENANTS_CACHE_KEY);
  return result;
}

export async function deleteTenantApi(tenantId: string) {
  const response = await fetch(`/api/tenants/${tenantId}`, {
    method: "DELETE",
  });
  const result = await parseApiResponse<TenantRecord>(response);
  invalidateApiCache(TENANTS_CACHE_KEY);
  return result;
}

export async function deleteAllTenantsApi() {
  const response = await fetch("/api/tenants", {
    method: "DELETE",
  });
  const result = await parseApiResponse<TenantRecord[]>(response);
  setApiCache(TENANTS_CACHE_KEY, result.data);
  return result;
}

export async function resetTenantsApi() {
  const response = await fetch("/api/tenants/reset", {
    method: "POST",
  });
  const result = await parseApiResponse<TenantRecord[]>(response);
  setApiCache(TENANTS_CACHE_KEY, result.data);
  return result;
}
