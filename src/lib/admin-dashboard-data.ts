import type { AppStore } from "@/lib/server-store";
import type {
  ActivityLogItem,
  AdminDashboardPayload,
  ExpiringTenantItem,
  RecentVideoItem,
  ScheduleDaySummary,
  SocialAccountSummary,
  TenantStatusDatum,
  UsageChartPoint,
} from "@/types/admin-dashboard";
import type { PublishingSchedule } from "@/types/integrations";
import type { TenantRecord } from "@/types/tenant-management";

export function createAdminDashboardPayload(store: AppStore): AdminDashboardPayload {
  const activeTenants = store.tenants.filter(
    (tenant) => tenant.status === "啟用中"
  ).length;
  const expiringTenants = createExpiringTenants(store.tenants);
  const totalVideos =
    store.tenants.reduce((total, tenant) => total + tenant.videos, 0) +
    store.integrations.mediaTasks.length;
  const monthlyVideos = getThisMonthMediaTaskCount(store);
  const apiUsage = getAverageApiUsage(store.tenants);

  return {
    statsCards: [
      {
        title: "總租戶數",
        value: String(store.tenants.length),
        change: "即時",
        changeType: "increase",
        icon: "building-2",
        color: "blue",
      },
      {
        title: "活躍租戶",
        value: String(activeTenants),
        change: "即時",
        changeType: "increase",
        icon: "badge-check",
        color: "green",
      },
      {
        title: "影片總數",
        value: totalVideos.toLocaleString(),
        change: "即時",
        changeType: "increase",
        icon: "film",
        color: "purple",
      },
      {
        title: "本月產出影片",
        value: String(monthlyVideos),
        change: "即時",
        changeType: "increase",
        icon: "sparkles",
        color: "orange",
      },
      {
        title: "本月使用量",
        value: `${apiUsage}%`,
        change: "即時",
        changeType: apiUsage > 80 ? "decrease" : "increase",
        icon: "activity",
        color: "red",
      },
    ],
    usageChartData: createUsageChartData(store),
    tenantStatus: createTenantStatus(store.tenants),
    expiringTenants,
    recentVideos: createRecentVideos(store),
    socialAccounts: createSocialAccounts(store),
    scheduleDays: createScheduleDays(store.integrations.schedules),
    activityLogs: createActivityLogs(store),
  };
}

function createTenantStatus(tenants: TenantRecord[]): TenantStatusDatum[] {
  const expiredCount = tenants.filter((tenant) => isExpired(tenant.expiredAt)).length;

  return [
    {
      name: "啟用中",
      value: tenants.filter((tenant) => tenant.status === "啟用中").length,
      color: "green",
    },
    {
      name: "已暫停",
      value: tenants.filter((tenant) => tenant.status === "已停權").length,
      color: "orange",
    },
    {
      name: "即將到期",
      value: tenants.filter((tenant) => tenant.status === "即將到期").length,
      color: "purple",
    },
    {
      name: "已過期",
      value: expiredCount,
      color: "red",
    },
  ];
}

function createUsageChartData(store: AppStore): UsageChartPoint[] {
  const today = new Date();

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const dateKey = date.toISOString().slice(0, 10);
    const video = store.integrations.mediaTasks.filter(
      (task) => task.createdAt.slice(0, 10) === dateKey
    ).length;
    const api = video * 12;

    return {
      date: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}`,
      video,
      api,
    };
  });
}

function createExpiringTenants(tenants: TenantRecord[]): ExpiringTenantItem[] {
  return tenants
    .filter((tenant) => tenant.status === "即將到期" || isExpiringSoon(tenant.expiredAt))
    .slice(0, 5)
    .map((tenant) => ({
      companyName: tenant.name,
      avatar: tenant.name.slice(0, 1),
      expiredAt: tenant.expiredAt,
      status: tenant.status === "即將到期" ? "即將到期" : "正常",
    }));
}

function createRecentVideos(store: AppStore): RecentVideoItem[] {
  return store.integrations.mediaTasks.slice(0, 5).map((task) => ({
    title: task.title,
    createdAt: formatDisplayDate(task.createdAt),
    thumbnail: "",
    duration: "00:30",
    status: task.status === "completed" ? "已完成" : "處理中",
  }));
}

function createSocialAccounts(store: AppStore): SocialAccountSummary[] {
  return store.integrations.socialPlatforms.map((platform) => ({
    platform: platform.name,
    connectedCount: platform.connectedCount,
    status: platform.status === "已驗證" ? "連線正常" : "尚未綁定",
  }));
}

function createScheduleDays(
  schedules: PublishingSchedule[]
): ScheduleDaySummary[] {
  return schedules.map((schedule) => ({
    date: schedule.publishAt.slice(0, 10),
    type:
      schedule.status === "已發布"
        ? "published"
        : schedule.status === "草稿"
          ? "draft"
          : "scheduled",
  }));
}

function createActivityLogs(store: AppStore): ActivityLogItem[] {
  const scheduleLogs = store.integrations.schedules.slice(0, 4).map((schedule) => ({
    time: formatDisplayDate(schedule.updatedAt ?? schedule.createdAt),
    actor: "系統排程",
    action: schedule.status === "已發布" ? "發布影片" : "更新排程",
    target: schedule.title,
    status: schedule.status,
  }));
  const mediaLogs = store.integrations.mediaTasks.slice(0, 4).map((task) => ({
    time: formatDisplayDate(task.updatedAt),
    actor: "AI 影片系統",
    action: "建立媒體任務",
    target: task.title,
    status: task.status === "completed" ? "成功" : "處理中",
  }));

  return [...scheduleLogs, ...mediaLogs]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 6);
}

function getThisMonthMediaTaskCount(store: AppStore) {
  const monthKey = new Date().toISOString().slice(0, 7);
  return store.integrations.mediaTasks.filter((task) =>
    task.createdAt.startsWith(monthKey)
  ).length;
}

function getAverageApiUsage(tenants: TenantRecord[]) {
  if (tenants.length === 0) {
    return 0;
  }

  const average =
    tenants.reduce((total, tenant) => total + tenant.apiUsage, 0) / tenants.length;
  return Number(average.toFixed(1));
}

function isExpiringSoon(value: string) {
  const expiry = parseDate(value);

  if (!expiry) {
    return false;
  }

  const days = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
}

function isExpired(value: string) {
  const expiry = parseDate(value);
  return expiry ? expiry.getTime() < Date.now() : false;
}

function parseDate(value: string) {
  const date = new Date(value.replaceAll("/", "-"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
