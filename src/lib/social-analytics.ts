import { socialPlatformMeta } from "@/data/social-operations";
import type { IntegrationState } from "@/lib/integration-service";
import type { SocialPlatformId } from "@/types/integrations";
import type {
  SocialAnalyticsPayload,
  SocialAnalyticsTrendPoint,
} from "@/types/social-operations";

export function createSocialAnalyticsPayload(
  integrations: IntegrationState
): SocialAnalyticsPayload {
  const generatedAt = new Date().toISOString();
  const schedules = integrations.schedules;
  const publishedCount = schedules.filter(
    (schedule) => schedule.status === "已發布"
  ).length;
  const scheduledCount = schedules.filter(
    (schedule) => schedule.status === "已排程"
  ).length;
  const failedCount = schedules.filter((schedule) => schedule.status === "失敗")
    .length;
  const connectedAccounts = integrations.socialAccounts.length;
  const successRate =
    publishedCount + failedCount === 0
      ? 0
      : Math.round((publishedCount / (publishedCount + failedCount)) * 100);

  return {
    generatedAt,
    stats: [
      {
        label: "已綁定帳號",
        value: String(connectedAccounts),
        description: "目前可用於排程的社群帳號",
        tone: "blue",
      },
      {
        label: "已排程貼文",
        value: String(scheduledCount),
        description: "等待發布的內容數",
        tone: "green",
      },
      {
        label: "發布成功率",
        value: `${successRate}%`,
        description: "依內部發布狀態即時計算",
        tone: successRate >= 80 ? "green" : "orange",
      },
      {
        label: "發布失敗",
        value: String(failedCount),
        description: "需要重新檢查 token 或素材",
        tone: failedCount > 0 ? "red" : "blue",
      },
    ],
    trend: buildTrend(integrations),
    platforms: socialPlatformMeta.map((meta) => {
      const platformSchedules = schedules.filter(
        (schedule) => schedule.platform === meta.id
      );
      const connected = integrations.socialAccounts.filter(
        (account) => account.platform === meta.id
      ).length;
      const platformFailed = platformSchedules.filter(
        (schedule) => schedule.status === "失敗"
      ).length;

      return {
        platform: meta.id,
        platformName: meta.label,
        connectedAccounts: connected,
        scheduledCount: platformSchedules.filter(
          (schedule) => schedule.status === "已排程"
        ).length,
        publishedCount: platformSchedules.filter(
          (schedule) => schedule.status === "已發布"
        ).length,
        failedCount: platformFailed,
        health:
          connected === 0 ? "待綁定" : platformFailed > 0 ? "需處理" : "良好",
      };
    }),
    insights: schedules.slice(0, 8).map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      platform: schedule.platform,
      platformName: getPlatformLabel(schedule.platform),
      status: schedule.status,
      publishAt: schedule.publishAt,
      signal: getScheduleSignal(schedule.status),
    })),
  };
}

function buildTrend(integrations: IntegrationState): SocialAnalyticsTrendPoint[] {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = toDateKey(date);
    const daySchedules = integrations.schedules.filter(
      (schedule) => toDateKey(new Date(schedule.publishAt)) === dateKey
    );

    return {
      date: dateKey.slice(5),
      scheduled: daySchedules.filter((schedule) => schedule.status === "已排程")
        .length,
      published: daySchedules.filter((schedule) => schedule.status === "已發布")
        .length,
      failed: daySchedules.filter((schedule) => schedule.status === "失敗")
        .length,
    };
  });
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getPlatformLabel(platform: SocialPlatformId) {
  return (
    socialPlatformMeta.find((meta) => meta.id === platform)?.label ?? platform
  );
}

function getScheduleSignal(status: string) {
  if (status === "已發布") {
    return "已完成發布，可接續追蹤平台互動數據。";
  }

  if (status === "失敗") {
    return "建議重新檢查 token、素材網址或平台權限。";
  }

  if (status === "草稿") {
    return "尚未進入排程，請補齊發布設定。";
  }

  return "已排入發布清單，等待執行。";
}
