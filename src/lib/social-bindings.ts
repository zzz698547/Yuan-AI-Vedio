import type { IntegrationState } from "@/lib/integration-service";
import type { SocialPlatformId } from "@/types/integrations";

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

export function deleteSocialAccountBinding(
  integrations: IntegrationState,
  accountId: string
) {
  const targetAccount = integrations.socialAccounts.find(
    (account) => account.id === accountId
  );

  if (!targetAccount) {
    throw new Error("找不到要刪除的社群帳號。");
  }

  integrations.socialAccounts = integrations.socialAccounts.filter(
    (account) => account.id !== accountId
  );
  integrations.socialTokens = integrations.socialTokens.filter(
    (token) => token.accountId !== accountId
  );
  integrations.schedules = integrations.schedules.map((schedule) =>
    schedule.accountId === accountId
      ? {
          ...schedule,
          accountId: undefined,
          status: "草稿",
          updatedAt: new Date().toISOString(),
          errorMessage: "原綁定帳號已刪除，請重新選擇帳號。",
        }
      : schedule
  );
  integrations.socialPlatforms = updatePlatformCounts(
    integrations,
    targetAccount.platform
  );

  return {
    platforms: integrations.socialPlatforms,
    accounts: integrations.socialAccounts,
  };
}

function updatePlatformCounts(
  integrations: IntegrationState,
  changedPlatform: SocialPlatformId
) {
  return integrations.socialPlatforms.map((platform) => {
    if (platform.id !== changedPlatform) {
      return platform;
    }

    const connectedCount = integrations.socialAccounts.filter(
      (account) => account.platform === platform.id
    ).length;

    return {
      ...platform,
      connectedCount,
      status: connectedCount > 0 ? platform.status : ("未設定" as const),
      lastSyncAt: new Date().toISOString(),
      lastMessage:
        connectedCount > 0
          ? "已更新綁定帳號清單。"
          : "此平台目前沒有已綁定帳號。",
    };
  });
}
