import { createSchedule, type IntegrationState } from "@/lib/integration-service";
import type {
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformId,
} from "@/types/integrations";
import type {
  PublishingSchedulePayload,
  ScheduleAction,
} from "@/types/social-operations";

type CreateSchedulePayload = {
  tenantId: string;
  title: string;
  platform: SocialPlatformId;
  accountId?: string;
  caption?: string;
  mediaUrl?: string;
  publishAt: string;
};

export function getPublishingSchedulePayload(
  integrations: IntegrationState
): PublishingSchedulePayload {
  return {
    schedules: [...integrations.schedules].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    accounts: integrations.socialAccounts,
    platforms: integrations.socialPlatforms,
  };
}

export function createPublishingScheduleRecord(
  integrations: IntegrationState,
  payload: CreateSchedulePayload
) {
  const account = getReadyPublishingAccount(
    integrations,
    payload.platform,
    payload.accountId
  );
  const schedule = createSchedule({
    ...payload,
    accountId: account.id,
  });

  integrations.schedules = [schedule, ...integrations.schedules];
  return schedule;
}

export function updatePublishingScheduleRecord(
  integrations: IntegrationState,
  scheduleId: string,
  action: ScheduleAction
) {
  const schedule = findSchedule(integrations, scheduleId);
  const now = new Date().toISOString();
  let nextSchedule: PublishingSchedule;

  if (action === "publish") {
    getReadyPublishingAccount(integrations, schedule.platform, schedule.accountId);
    nextSchedule = {
      ...schedule,
      status: "已發布",
      publishedAt: now,
      updatedAt: now,
      errorMessage: undefined,
    };
  } else if (action === "fail") {
    nextSchedule = {
      ...schedule,
      status: "失敗",
      updatedAt: now,
      errorMessage: "已由使用者手動標記為發布失敗。",
    };
  } else {
    nextSchedule = {
      ...schedule,
      status: "草稿",
      updatedAt: now,
      errorMessage: undefined,
    };
  }

  integrations.schedules = integrations.schedules.map((item) =>
    item.id === scheduleId ? nextSchedule : item
  );
  return nextSchedule;
}

export function deletePublishingScheduleRecord(
  integrations: IntegrationState,
  scheduleId: string
) {
  const schedule = findSchedule(integrations, scheduleId);
  integrations.schedules = integrations.schedules.filter(
    (item) => item.id !== schedule.id
  );
  return getPublishingSchedulePayload(integrations);
}

function findSchedule(integrations: IntegrationState, scheduleId: string) {
  const schedule = integrations.schedules.find((item) => item.id === scheduleId);

  if (!schedule) {
    throw new Error("找不到排程。");
  }

  return schedule;
}

function getReadyPublishingAccount(
  integrations: IntegrationState,
  platform: SocialPlatformId,
  accountId: string | undefined
) {
  if (!accountId) {
    throw new Error("請先選擇已綁定的社群帳號。");
  }

  const account = integrations.socialAccounts.find(
    (item) => item.id === accountId
  );

  if (!account || account.platform !== platform) {
    throw new Error("此帳號不存在，或不屬於選擇的平台。");
  }

  validatePublishingAccount(integrations, account);
  return account;
}

function validatePublishingAccount(
  integrations: IntegrationState,
  account: SocialAccountBinding
) {
  const token = integrations.socialTokens.find(
    (item) => item.accountId === account.id
  );

  if (!token) {
    throw new Error("找不到可用 Access Token，請重新綁定此社群帳號。");
  }

  if (account.tokenStatus !== "正常") {
    throw new Error("此帳號 Token 狀態不可用，請重新授權。");
  }

  if (
    account.permissionStatus !== "可發文" &&
    account.permissionStatus !== "可上傳"
  ) {
    throw new Error("此帳號目前沒有發布權限。");
  }
}
