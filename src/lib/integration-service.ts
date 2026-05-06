import {
  initialAiProviders,
  initialModelFeatures,
  initialSocialAccounts,
  initialSocialPlatforms,
} from "@/data/integrations";
import type {
  AiProviderBinding,
  AiProviderId,
  AiProviderSecret,
  MediaTask,
  MediaTaskType,
  ModelFeatureBinding,
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
  SocialTokenRecord,
} from "@/types/integrations";

export type IntegrationState = {
  aiProviders: AiProviderBinding[];
  aiProviderSecrets: AiProviderSecret[];
  modelFeatures: ModelFeatureBinding[];
  socialPlatforms: SocialPlatformBinding[];
  socialAccounts: SocialAccountBinding[];
  socialTokens: SocialTokenRecord[];
  schedules: PublishingSchedule[];
  mediaTasks: MediaTask[];
};

export function createInitialIntegrationState(): IntegrationState {
  return {
    aiProviders: initialAiProviders.map((provider) => ({ ...provider })),
    aiProviderSecrets: [],
    modelFeatures: initialModelFeatures.map((feature) => ({ ...feature })),
    socialPlatforms: initialSocialPlatforms.map((platform) => ({
      ...platform,
      scopes: [...platform.scopes],
    })),
    socialAccounts: initialSocialAccounts.map((account) => ({ ...account })),
    socialTokens: [],
    schedules: [],
    mediaTasks: [],
  };
}

export function maskSecret(secret: string) {
  if (!secret) {
    return "尚未設定";
  }

  if (secret.length <= 8) {
    return "****";
  }

  return `${secret.slice(0, 4)}****${secret.slice(-4)}`;
}

export async function testAiProviderConnection(
  provider: AiProviderBinding,
  apiKeyOverride?: string
) {
  const apiKey = apiKeyOverride ?? process.env[provider.envKey];
  const testedAt = new Date().toISOString();

  if (!apiKey) {
    return {
      ...provider,
      status: "缺少環境變數" as const,
      maskedKey: "尚未設定",
      lastTestedAt: testedAt,
      lastMessage: `請先輸入 API Key，或在 Vercel / .env.local 設定 ${provider.envKey}。`,
    };
  }

  if (provider.id === "openai") {
    return testOpenAi(provider, apiKey, testedAt);
  }

  if (provider.id === "gemini") {
    return testGemini(provider, apiKey, testedAt);
  }

  return {
    ...provider,
    status: "已設定" as const,
    maskedKey: maskSecret(apiKey),
    lastTestedAt: testedAt,
    lastMessage: "自訂 Provider 已找到 API Key，請在正式 adapter 中補上供應商健康檢查端點。",
  };
}

export function createOAuthStart(platform: SocialPlatformBinding) {
  const clientId = process.env[platform.clientIdEnv];
  const clientSecret = process.env[platform.clientSecretEnv];
  const checkedAt = new Date().toISOString();

  if (!clientId || !clientSecret) {
    return {
      platform: {
        ...platform,
        status: "缺少環境變數" as const,
        lastSyncAt: checkedAt,
        lastMessage: `請設定 ${platform.clientIdEnv} 與 ${platform.clientSecretEnv}。`,
      },
      authorizationUrl: null,
    };
  }

  return {
    platform: {
      ...platform,
      status: "OAuth 待完成" as const,
      lastSyncAt: checkedAt,
      lastMessage: "OAuth authorization URL 已建立，等待平台 callback。",
    },
    authorizationUrl: buildOAuthUrl(platform, clientId),
  };
}

export function createManualSocialBinding(payload: {
  platform: SocialPlatformId;
  accountName: string;
  tenantName: string;
  accessToken: string;
  scopes?: string[];
}) {
  const accountName = payload.accountName.trim();
  const tenantName = payload.tenantName.trim() || "目前租戶";
  const accessToken = payload.accessToken.trim();

  if (!accountName || !accessToken) {
    throw new Error("帳號名稱與 Access Token 皆為必填。");
  }

  if (accessToken.length < 8) {
    throw new Error("Access Token 至少需要 8 個字元。");
  }

  const now = new Date().toISOString();
  const accountId = `social-${payload.platform}-${Date.now()}`;
  const account = {
    id: accountId,
    platform: payload.platform,
    accountName,
    tenantName,
    tokenMasked: maskSecret(accessToken),
    bindingMethod: "Manual" as const,
    tokenStatus: "正常" as const,
    permissionStatus: payload.platform === "youtube" ? ("可上傳" as const) : ("可發文" as const),
    grantedScopes: payload.scopes ?? [],
    syncedAt: now,
  };
  const tokenRecord = {
    accountId,
    platform: payload.platform,
    accessToken,
    scopes: payload.scopes ?? [],
    tokenType: "manual",
    createdAt: now,
  };

  return { account, tokenRecord };
}

export function createSchedule(payload: {
  tenantId: string;
  title: string;
  platform: SocialPlatformId;
  accountId?: string;
  caption?: string;
  mediaUrl?: string;
  publishAt: string;
}) {
  const title = payload.title.trim();
  const publishDate = new Date(payload.publishAt);
  const now = new Date().toISOString();

  if (!payload.tenantId.trim() || !title || Number.isNaN(publishDate.getTime())) {
    throw new Error("租戶、標題與發布時間皆為必填。");
  }

  return {
    id: `schedule-${Date.now()}`,
    tenantId: payload.tenantId.trim(),
    title,
    platform: payload.platform,
    accountId: payload.accountId?.trim() || undefined,
    caption: payload.caption?.trim() || undefined,
    mediaUrl: payload.mediaUrl?.trim() || undefined,
    publishAt: publishDate.toISOString(),
    status: "已排程" as const,
    createdAt: now,
    updatedAt: now,
  };
}

export function createMediaTask(payload: {
  tenantId: string;
  type: MediaTaskType;
  title: string;
  input: string;
}) {
  if (!payload.tenantId.trim() || !payload.title.trim() || !payload.input.trim()) {
    throw new Error("租戶、任務標題與輸入內容皆為必填。");
  }

  const now = new Date().toISOString();
  const output = buildMediaTaskOutput(payload.type, payload.input);

  return {
    id: `task-${Date.now()}`,
    tenantId: payload.tenantId.trim(),
    type: payload.type,
    title: payload.title.trim(),
    input: payload.input.trim(),
    status: "completed" as const,
    output,
    createdAt: now,
    updatedAt: now,
  };
}

export function isAiProviderId(value: unknown): value is AiProviderId {
  return value === "openai" || value === "gemini" || value === "custom";
}

export function isSocialPlatformId(value: unknown): value is SocialPlatformId {
  return (
    value === "facebook" ||
    value === "instagram" ||
    value === "tiktok" ||
    value === "youtube"
  );
}

async function testOpenAi(
  provider: AiProviderBinding,
  apiKey: string,
  testedAt: string
) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAI 回應 ${response.status}`);
    }

    return {
      ...provider,
      status: "已驗證" as const,
      maskedKey: maskSecret(apiKey),
      lastTestedAt: testedAt,
      lastMessage: "OpenAI Models API 驗證成功。",
    };
  } catch (error) {
    return {
      ...provider,
      status: "驗證失敗" as const,
      maskedKey: maskSecret(apiKey),
      lastTestedAt: testedAt,
      lastMessage: error instanceof Error ? error.message : "OpenAI 驗證失敗。",
    };
  }
}

async function testGemini(
  provider: AiProviderBinding,
  apiKey: string,
  testedAt: string
) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Gemini 回應 ${response.status}`);
    }

    return {
      ...provider,
      status: "已驗證" as const,
      maskedKey: maskSecret(apiKey),
      lastTestedAt: testedAt,
      lastMessage: "Gemini Models API 驗證成功。",
    };
  } catch (error) {
    return {
      ...provider,
      status: "驗證失敗" as const,
      maskedKey: maskSecret(apiKey),
      lastTestedAt: testedAt,
      lastMessage: error instanceof Error ? error.message : "Gemini 驗證失敗。",
    };
  }
}

function buildOAuthUrl(platform: SocialPlatformBinding, clientId: string) {
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ||
      "http://localhost:3000/api/integrations/social/oauth/callback"
  );
  const scope = encodeURIComponent(platform.scopes.join(","));
  const state = encodeURIComponent(`${platform.id}:${Date.now()}`);
  return `https://auth.example.com/${platform.id}?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
}

function buildMediaTaskOutput(type: MediaTaskType, input: string) {
  if (type === "reference-analysis") {
    return `已完成參考分析：抽取主題、節奏、CTA 與原創腳本方向。來源：${input}`;
  }

  if (type === "video-generation") {
    return `已建立 AI 影片生成任務：腳本、素材清單與輸出比例已排入流程。輸入：${input}`;
  }

  return `已完成剪輯任務：去除空白、自動字幕、9:16 轉換與 CTA 片尾。素材：${input}`;
}
