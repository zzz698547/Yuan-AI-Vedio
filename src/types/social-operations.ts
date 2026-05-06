import type {
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

export type ScheduleAction = "publish" | "draft" | "fail";

export type PublishingSchedulePayload = {
  schedules: PublishingSchedule[];
  accounts: SocialAccountBinding[];
  platforms: SocialPlatformBinding[];
};

export type SocialAnalyticsStat = {
  label: string;
  value: string;
  description: string;
  tone: "blue" | "green" | "orange" | "red";
};

export type SocialAnalyticsTrendPoint = {
  date: string;
  scheduled: number;
  published: number;
  failed: number;
};

export type SocialPlatformAnalytics = {
  platform: SocialPlatformId;
  platformName: string;
  connectedAccounts: number;
  scheduledCount: number;
  publishedCount: number;
  failedCount: number;
  health: "良好" | "待綁定" | "需處理";
};

export type SocialContentInsight = {
  id: string;
  title: string;
  platform: SocialPlatformId;
  platformName: string;
  status: PublishingSchedule["status"];
  publishAt: string;
  signal: string;
};

export type SocialAnalyticsPayload = {
  stats: SocialAnalyticsStat[];
  trend: SocialAnalyticsTrendPoint[];
  platforms: SocialPlatformAnalytics[];
  insights: SocialContentInsight[];
  generatedAt: string;
};
