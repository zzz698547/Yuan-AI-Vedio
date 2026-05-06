import { parseApiResponse } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type {
  TenantAutomationSettings,
  TenantAutomationState,
  TenantCandidateAction,
} from "@/types/tenant-automation";

export async function fetchTenantAutomation(tenantId: string) {
  const response = await fetch(
    `/api/tenant/auto-generate?tenantId=${encodeURIComponent(tenantId)}`
  );
  return parseApiResponse<TenantAutomationState>(response) as Promise<
    ApiResponse<TenantAutomationState>
  >;
}

export async function saveTenantAutomationSettings(
  tenantId: string,
  settings: TenantAutomationSettings
) {
  const response = await fetch("/api/tenant/auto-generate", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...settings, tenantId }),
  });

  return parseApiResponse<TenantAutomationState>(response) as Promise<
    ApiResponse<TenantAutomationState>
  >;
}

export async function generateTenantCandidates(tenantId: string) {
  const response = await fetch("/api/tenant/auto-generate/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tenantId }),
  });

  return parseApiResponse<TenantAutomationState>(response) as Promise<
    ApiResponse<TenantAutomationState>
  >;
}

export async function updateTenantCandidate(
  tenantId: string,
  candidateId: string,
  action: TenantCandidateAction
) {
  const response = await fetch(`/api/tenant/auto-generate/candidates/${candidateId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tenantId, action }),
  });

  return parseApiResponse<TenantAutomationState>(response) as Promise<
    ApiResponse<TenantAutomationState>
  >;
}
