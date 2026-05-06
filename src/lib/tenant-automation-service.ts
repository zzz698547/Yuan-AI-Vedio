import {
  createInitialTenantAutomationState,
  tenantAutoPlatforms,
  tenantPublishRules,
} from "@/data/tenant-automation";
import type {
  TenantAutoPlatform,
  TenantAutomationSettings,
  TenantAutomationState,
  TenantCandidateAction,
  TenantCandidateRisk,
  TenantCandidateStatus,
  TenantCandidateVideo,
  TenantPublishRule,
  TenantTrendRadar,
} from "@/types/tenant-automation";

export function cloneAutomationState(state: TenantAutomationState) {
  return {
    ...state,
    settings: {
      ...state.settings,
      targetPlatforms: [...state.settings.targetPlatforms],
      industryTags: [...state.settings.industryTags],
      blockedTopics: [...state.settings.blockedTopics],
      publishRules: [...state.settings.publishRules],
    },
    candidateVideos: state.candidateVideos.map((video) => ({ ...video })),
    trends: state.trends.map((trend) => ({ ...trend })),
    aiSuggestions: [...state.aiSuggestions],
  };
}

export function createAutomationState(tenantId: string) {
  return createInitialTenantAutomationState(tenantId);
}

export function validateAutomationSettings(
  payload: Partial<TenantAutomationSettings>
) {
  const enabled = payload.enabled;
  const dailyCount = payload.dailyCount;

  if (typeof enabled !== "boolean") {
    throw new Error("自動產出開關格式不正確。");
  }

  if (
    typeof dailyCount !== "number" ||
    !Number.isInteger(dailyCount) ||
    dailyCount < 1 ||
    dailyCount > 10
  ) {
    throw new Error("每日產出數量必須介於 1 到 10。");
  }

  const targetPlatforms = validatePlatforms(payload.targetPlatforms);
  const publishRules = validatePublishRules(payload.publishRules);
  const industryTags = normalizeTags(payload.industryTags, "產業關鍵字");
  const blockedTopics = normalizeTags(payload.blockedTopics, "禁用主題");

  return {
    enabled,
    dailyCount,
    targetPlatforms,
    industryTags,
    blockedTopics,
    publishRules,
  };
}

export function generateCandidates(state: TenantAutomationState) {
  if (!state.settings.enabled) {
    throw new Error("請先啟用自動產出。");
  }

  if (state.settings.targetPlatforms.length === 0) {
    throw new Error("至少需要選擇一個目標平台。");
  }

  if (state.settings.industryTags.length === 0) {
    throw new Error("至少需要一個產業關鍵字。");
  }

  const generatedAt = new Date().toISOString();
  const candidates = Array.from({ length: state.settings.dailyCount }, (_, index) =>
    createCandidate(state, index, generatedAt)
  );

  const nextState: TenantAutomationState = {
    ...state,
    candidateVideos: [...candidates, ...state.candidateVideos],
    trends: createTrendRadar(state.settings.industryTags),
    aiSuggestions: createSuggestions(state.settings.industryTags),
    lastGeneratedAt: generatedAt,
  };

  return cloneAutomationState(nextState);
}

export function applyCandidateAction(
  state: TenantAutomationState,
  candidateId: string,
  action: TenantCandidateAction
) {
  const nextStatus = getStatusForAction(action);
  const exists = state.candidateVideos.some((candidate) => candidate.id === candidateId);

  if (!exists) {
    throw new Error("找不到指定候選影片。");
  }

  return cloneAutomationState({
    ...state,
    candidateVideos: state.candidateVideos.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, status: nextStatus } : candidate
    ),
  });
}

function validatePlatforms(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("目標平台格式不正確。");
  }

  return value.filter((item): item is TenantAutoPlatform =>
    tenantAutoPlatforms.includes(item as TenantAutoPlatform)
  );
}

function validatePublishRules(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("發布規則格式不正確。");
  }

  return value.filter((item): item is TenantPublishRule =>
    tenantPublishRules.includes(item as TenantPublishRule)
  );
}

function normalizeTags(value: unknown, label: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${label}格式不正確。`);
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, 12);
}

function createCandidate(
  state: TenantAutomationState,
  index: number,
  generatedAt: string
): TenantCandidateVideo {
  const keyword = state.settings.industryTags[index % state.settings.industryTags.length];
  const platform = state.settings.targetPlatforms[index % state.settings.targetPlatforms.length];
  const trendScore = Math.max(62, 95 - index * 4);
  const brandFit = Math.max(58, 88 - index * 3);
  const risk: TenantCandidateRisk = state.settings.blockedTopics.some((topic) =>
    keyword.includes(topic)
  )
    ? "高"
    : index % 3 === 2
      ? "中"
      : "低";

  return {
    id: `candidate-${Date.now()}-${index}`,
    title: `${keyword}短影音腳本 ${index + 1}: 從痛點到行動`,
    platform,
    trendScore,
    brandFit,
    risk,
    status: risk === "高" ? "待修改" : "待審核",
    createdAt: generatedAt,
  };
}

function createTrendRadar(tags: string[]): TenantTrendRadar[] {
  const colors: TenantTrendRadar["color"][] = ["blue", "green", "purple", "orange"];

  return tags.slice(0, 5).map((tag, index) => ({
    label: tag,
    value: Math.max(55, 92 - index * 7),
    color: colors[index % colors.length],
  }));
}

function createSuggestions(tags: string[]) {
  const primaryTag = tags[0] ?? "品牌內容";

  return [
    `今天建議優先產出「${primaryTag}」教學型短片，適合做 30 秒內 Hook。`,
    "若要自動排程，請先完成社群帳號 OAuth 綁定與發布權限驗證。",
    "高風險內容會被留在待修改狀態，不會直接進入排程。",
  ];
}

function getStatusForAction(action: TenantCandidateAction): TenantCandidateStatus {
  const statusByAction: Record<TenantCandidateAction, TenantCandidateStatus> = {
    approve: "待審核",
    reject: "已拒絕",
    schedule: "已排程",
    revise: "待修改",
  };

  return statusByAction[action];
}
