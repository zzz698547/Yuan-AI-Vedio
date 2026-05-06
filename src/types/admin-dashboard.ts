export type AdminStatCardData = {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
};

export type UsageChartPoint = {
  date: string;
  video: number;
  api: number;
};

export type TenantStatusDatum = {
  name: string;
  value: number;
  color: "green" | "orange" | "purple" | "red";
};

export type ExpiringTenantItem = {
  companyName: string;
  avatar: string;
  expiredAt: string;
  status: string;
};

export type RecentVideoItem = {
  title: string;
  createdAt: string;
  thumbnail: string;
  duration: string;
  status: string;
};

export type SocialAccountSummary = {
  platform: string;
  connectedCount: number;
  status: string;
};

export type ScheduleDaySummary = {
  date: string;
  type: "scheduled" | "published" | "draft";
};

export type ActivityLogItem = {
  time: string;
  actor: string;
  action: string;
  target: string;
  status: string;
};

export type AdminDashboardPayload = {
  statsCards: AdminStatCardData[];
  usageChartData: UsageChartPoint[];
  tenantStatus: TenantStatusDatum[];
  expiringTenants: ExpiringTenantItem[];
  recentVideos: RecentVideoItem[];
  socialAccounts: SocialAccountSummary[];
  scheduleDays: ScheduleDaySummary[];
  activityLogs: ActivityLogItem[];
};
