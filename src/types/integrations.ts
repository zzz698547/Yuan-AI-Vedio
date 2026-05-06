export type AiProviderId = "openai" | "gemini" | "custom";

export type IntegrationStatus =
  | "未設定"
  | "缺少環境變數"
  | "已設定"
  | "已驗證"
  | "驗證失敗";

export type AiProviderBinding = {
  id: AiProviderId;
  name: string;
  envKey: string;
  purpose: string;
  status: IntegrationStatus;
  maskedKey: string;
  bindingSource?: "env" | "manual";
  lastTestedAt?: string;
  lastMessage?: string;
};

export type AiProviderSecret = {
  providerId: AiProviderId;
  apiKey: string;
  savedAt: string;
  source: "manual";
};

export type ModelFeatureBinding = {
  feature: string;
  currentModel: string;
  fallbackModel: string;
  estimatedCost: string;
  status: "啟用中" | "測試中" | "待設定";
};

export type SocialPlatformId = "facebook" | "instagram" | "tiktok" | "youtube";

export type SocialPlatformBinding = {
  id: SocialPlatformId;
  name: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  scopes: string[];
  status: IntegrationStatus | "OAuth 待完成";
  connectedCount: number;
  lastSyncAt?: string;
  lastMessage?: string;
};

export type SocialAccountBinding = {
  id: string;
  platform: SocialPlatformId;
  accountName: string;
  tenantName: string;
  tokenMasked?: string;
  bindingMethod?: "OAuth" | "Manual";
  expiresAt?: string;
  grantedScopes?: string[];
  tokenStatus: "正常" | "即將過期" | "失效" | "未綁定";
  permissionStatus: "可發文" | "可上傳" | "待授權" | "不可發文";
  syncedAt?: string;
};

export type SocialTokenRecord = {
  accountId: string;
  platform: SocialPlatformId;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scopes: string[];
  tokenType?: string;
  createdAt: string;
};

export type ScheduleStatus = "草稿" | "已排程" | "已發布" | "失敗";

export type PublishingSchedule = {
  id: string;
  tenantId: string;
  title: string;
  platform: SocialPlatformId;
  publishAt: string;
  status: ScheduleStatus;
  createdAt: string;
};

export type MediaTaskType =
  | "reference-analysis"
  | "video-generation"
  | "video-editing";

export type MediaTaskStatus = "queued" | "processing" | "completed" | "failed";

export type MediaTask = {
  id: string;
  tenantId: string;
  type: MediaTaskType;
  title: string;
  input: string;
  status: MediaTaskStatus;
  output?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};
