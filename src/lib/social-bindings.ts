import type { IntegrationState } from "@/lib/integration-service";

export function clearAllSocialBindings(integrations: IntegrationState) {
  integrations.socialAccounts = [];
  integrations.socialTokens = [];
  integrations.socialPlatforms = integrations.socialPlatforms.map((platform) => ({
    ...platform,
    status: "未設定",
    connectedCount: 0,
    lastSyncAt: undefined,
    lastMessage: "已刪除所有綁定帳號。",
  }));

  return {
    platforms: integrations.socialPlatforms,
    accounts: integrations.socialAccounts,
  };
}
