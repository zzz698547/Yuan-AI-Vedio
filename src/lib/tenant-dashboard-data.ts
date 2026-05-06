import { initialTenantDashboardData } from "@/data/tenant-dashboard";
import type { AppStore } from "@/lib/server-store";
import type { MediaTask, PublishingSchedule } from "@/types/integrations";
import type {
  TenantDashboardData,
  TenantDashboardTask,
  TenantProject,
  TenantUpcomingPost,
  TenantVideoTrendPoint,
} from "@/types/tenant-dashboard";

export function createTenantDashboardPayload(
  store: AppStore,
  tenantId = "default-tenant"
): TenantDashboardData {
  const tenant = store.tenants.find((item) => item.id === tenantId);
  const mediaTasks = store.integrations.mediaTasks.filter(
    (task) => task.tenantId === tenantId
  );
  const schedules = store.integrations.schedules.filter(
    (schedule) => schedule.tenantId === tenantId
  );
  const monthlyVideos = countThisMonthVideos(mediaTasks);
  const scheduledPosts = schedules.filter(
    (schedule) => schedule.status === "已排程"
  ).length;
  const publishedPosts = schedules.filter(
    (schedule) => schedule.status === "已發布"
  ).length;
  const remainingQuota = tenant ? Math.max(0, 100 - tenant.apiUsage) : 100;

  return {
    stats: [
      {
        ...initialTenantDashboardData.stats[0],
        value: String(monthlyVideos),
        change: monthlyVideos > 0 ? "本月累積" : "尚未產出",
      },
      {
        ...initialTenantDashboardData.stats[1],
        value: String(scheduledPosts),
        change: scheduledPosts > 0 ? "等待發布" : "尚未排程",
      },
      {
        ...initialTenantDashboardData.stats[2],
        value: String(publishedPosts),
        change: publishedPosts > 0 ? "已完成發布" : "尚未發布",
      },
      initialTenantDashboardData.stats[3],
      {
        ...initialTenantDashboardData.stats[4],
        value: `${remainingQuota}%`,
        change: tenant ? "依使用量計算" : "全新額度",
      },
    ],
    videoTrend: createVideoTrend(mediaTasks),
    platformPerformance: [],
    tasks: createTasks(schedules),
    quickActions: initialTenantDashboardData.quickActions,
    recentProjects: createRecentProjects(mediaTasks),
    upcomingPosts: createUpcomingPosts(schedules),
    aiSuggestions: [],
    socialStatus: store.integrations.socialPlatforms.map((platform) => ({
      platform: platform.name,
      connected: platform.connectedCount > 0,
      count: platform.connectedCount,
    })),
  };
}

function createVideoTrend(mediaTasks: MediaTask[]): TenantVideoTrendPoint[] {
  if (mediaTasks.length === 0) {
    return [];
  }

  const today = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}`,
      videos: mediaTasks.filter((task) => task.createdAt.slice(0, 10) === dateKey)
        .length,
    };
  });
}

function createTasks(schedules: PublishingSchedule[]): TenantDashboardTask[] {
  return schedules
    .filter((schedule) => schedule.status === "草稿" || schedule.status === "失敗")
    .slice(0, 4)
    .map((schedule) => ({
      title: schedule.title,
      detail:
        schedule.status === "失敗"
          ? schedule.errorMessage ?? "排程發布失敗，請檢查社群授權。"
          : "草稿尚未排程發布。",
      status: schedule.status === "失敗" ? "重要" : "待處理",
    }));
}

function createRecentProjects(mediaTasks: MediaTask[]): TenantProject[] {
  return mediaTasks.slice(0, 4).map((task) => ({
    title: task.title,
    time: formatDisplayDate(task.updatedAt),
    status: task.status === "completed" ? "已完成" : "待審核",
  }));
}

function createUpcomingPosts(
  schedules: PublishingSchedule[]
): TenantUpcomingPost[] {
  return schedules
    .filter((schedule) => schedule.status === "已排程")
    .slice(0, 4)
    .map((schedule) => ({
      title: schedule.title,
      platform: getPlatformName(schedule.platform),
      time: formatDisplayDate(schedule.publishAt),
    }));
}

function countThisMonthVideos(mediaTasks: MediaTask[]) {
  const monthKey = new Date().toISOString().slice(0, 7);
  return mediaTasks.filter(
    (task) =>
      task.type === "video-generation" && task.createdAt.startsWith(monthKey)
  ).length;
}

function getPlatformName(platform: PublishingSchedule["platform"]) {
  const names: Record<PublishingSchedule["platform"], string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
  };

  return names[platform];
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
