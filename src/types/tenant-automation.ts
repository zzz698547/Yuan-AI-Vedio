export type TenantAutoPlatform =
  | "TikTok"
  | "Instagram Reels"
  | "YouTube Shorts"
  | "Facebook Reels";

export type TenantPublishRule =
  | "需要人工審核"
  | "高風險內容不自動發布"
  | "相似度過高不發布"
  | "自動加入 AI 輔助標示";

export type TenantCandidateRisk = "低" | "中" | "高";

export type TenantCandidateStatus =
  | "草稿"
  | "待審核"
  | "待修改"
  | "已排程"
  | "已拒絕";

export type TenantAutomationSettings = {
  enabled: boolean;
  dailyCount: number;
  targetPlatforms: TenantAutoPlatform[];
  industryTags: string[];
  blockedTopics: string[];
  publishRules: TenantPublishRule[];
};

export type TenantCandidateVideo = {
  id: string;
  title: string;
  platform: TenantAutoPlatform;
  trendScore: number;
  brandFit: number;
  risk: TenantCandidateRisk;
  status: TenantCandidateStatus;
  createdAt: string;
};

export type TenantTrendRadar = {
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange";
};

export type TenantAutomationState = {
  tenantId: string;
  settings: TenantAutomationSettings;
  candidateVideos: TenantCandidateVideo[];
  trends: TenantTrendRadar[];
  aiSuggestions: string[];
  lastGeneratedAt?: string;
};

export type TenantCandidateAction = "approve" | "reject" | "schedule" | "revise";
