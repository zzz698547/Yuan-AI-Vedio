export type TenantDashboardStat = {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  color: "blue" | "green" | "purple" | "orange" | "red";
  iconName: string;
};

export type TenantVideoTrendPoint = {
  date: string;
  videos: number;
};

export type TenantPlatformPerformance = {
  platform: string;
  engagement: number;
};

export type TenantDashboardTask = {
  title: string;
  detail: string;
  status: "待處理" | "重要" | "已排程";
};

export type TenantQuickAction = {
  title: string;
  iconName: string;
};

export type TenantProject = {
  title: string;
  time: string;
  status: "已完成" | "待審核" | "草稿";
};

export type TenantUpcomingPost = {
  title: string;
  platform: string;
  time: string;
};

export type TenantSocialStatus = {
  platform: string;
  connected: boolean;
  count: number;
};

export type TenantDashboardData = {
  stats: TenantDashboardStat[];
  videoTrend: TenantVideoTrendPoint[];
  platformPerformance: TenantPlatformPerformance[];
  tasks: TenantDashboardTask[];
  quickActions: TenantQuickAction[];
  recentProjects: TenantProject[];
  upcomingPosts: TenantUpcomingPost[];
  aiSuggestions: string[];
  socialStatus: TenantSocialStatus[];
};
