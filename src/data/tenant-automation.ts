import type {
  TenantAutomationState,
  TenantPublishRule,
  TenantAutoPlatform,
} from "@/types/tenant-automation";

export const tenantAutoPlatforms: TenantAutoPlatform[] = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Reels",
];

export const tenantPublishRules: TenantPublishRule[] = [
  "需要人工審核",
  "高風險內容不自動發布",
  "相似度過高不發布",
  "自動加入 AI 輔助標示",
];

export function createInitialTenantAutomationState(
  tenantId: string
): TenantAutomationState {
  return {
    tenantId,
    settings: {
      enabled: false,
      dailyCount: 3,
      targetPlatforms: [],
      industryTags: [],
      blockedTopics: ["政治", "醫療誇大", "投資保證"],
      publishRules: ["需要人工審核", "高風險內容不自動發布"],
    },
    candidateVideos: [],
    trends: [
      { label: "AI 工具教學", value: 0, color: "blue" },
      { label: "品牌短影音", value: 0, color: "green" },
      { label: "電商轉換", value: 0, color: "purple" },
      { label: "創辦人觀點", value: 0, color: "orange" },
      { label: "效率工作流", value: 0, color: "blue" },
    ],
    aiSuggestions: [],
  };
}
