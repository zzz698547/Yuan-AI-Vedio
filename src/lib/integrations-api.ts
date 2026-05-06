import { parseApiResponse } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type {
  AiProviderBinding,
  AiProviderId,
  MediaTask,
  MediaTaskType,
  ModelFeatureBinding,
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

export type AiModelsPayload = {
  providers: AiProviderBinding[];
  modelFeatures: ModelFeatureBinding[];
};

export type SocialPayload = {
  platforms: SocialPlatformBinding[];
  accounts: SocialAccountBinding[];
  authorizationUrl?: string | null;
};

export async function fetchAiModels() {
  const response = await fetch("/api/integrations/ai-models");
  return parseApiResponse<AiModelsPayload>(response) as Promise<
    ApiResponse<AiModelsPayload>
  >;
}

export async function testAiProvider(providerId: AiProviderId) {
  const response = await fetch("/api/integrations/ai-models/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ providerId }),
  });
  return parseApiResponse<AiModelsPayload & { provider: AiProviderBinding }>(
    response
  );
}

export async function bindAiProvider(payload: {
  providerId: AiProviderId;
  apiKey: string;
}) {
  const response = await fetch("/api/integrations/ai-models/bind", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<AiModelsPayload>(response) as Promise<
    ApiResponse<AiModelsPayload>
  >;
}

export async function unbindAiProvider(providerId: AiProviderId) {
  const response = await fetch("/api/integrations/ai-models/bind", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ providerId }),
  });
  return parseApiResponse<AiModelsPayload>(response) as Promise<
    ApiResponse<AiModelsPayload>
  >;
}

export async function updateAiModelFeature(payload: ModelFeatureBinding) {
  const response = await fetch("/api/integrations/ai-models/features", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<AiModelsPayload>(response) as Promise<
    ApiResponse<AiModelsPayload>
  >;
}

export async function fetchSocialIntegrations() {
  const response = await fetch("/api/integrations/social");
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function startSocialOAuth(platformId: SocialPlatformId) {
  const response = await fetch("/api/integrations/social/oauth/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ platformId, returnTo: "/admin/social-accounts" }),
  });
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function startTenantSocialOAuth(payload: {
  platformId: SocialPlatformId;
  tenantName: string;
}) {
  const response = await fetch("/api/integrations/social/oauth/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, returnTo: "/tenant/social-accounts" }),
  });
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function syncSocialPlatform(platformId: SocialPlatformId) {
  const response = await fetch("/api/integrations/social/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ platformId }),
  });
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function manualBindSocialAccount(payload: {
  platform: SocialPlatformId;
  accountName: string;
  tenantName: string;
  accessToken: string;
}) {
  const response = await fetch("/api/integrations/social/manual-bind", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function deleteAllSocialAccounts() {
  const response = await fetch("/api/integrations/social", {
    method: "DELETE",
  });
  return parseApiResponse<SocialPayload>(response) as Promise<
    ApiResponse<SocialPayload>
  >;
}

export async function createPublishingSchedule(payload: {
  tenantId: string;
  title: string;
  platform: SocialPlatformId;
  publishAt: string;
}) {
  const response = await fetch("/api/schedules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<PublishingSchedule>(response) as Promise<
    ApiResponse<PublishingSchedule>
  >;
}

export async function createMediaTask(payload: {
  tenantId: string;
  type: MediaTaskType;
  title: string;
  input: string;
}) {
  const response = await fetch("/api/media-tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<MediaTask>(response) as Promise<ApiResponse<MediaTask>>;
}
