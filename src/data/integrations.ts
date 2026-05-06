import type {
  AiProviderBinding,
  ModelFeatureBinding,
  SocialAccountBinding,
  SocialPlatformBinding,
} from "@/types/integrations";

export const initialAiProviders: AiProviderBinding[] = [
  {
    id: "openai",
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    purpose: "腳本生成、影片分析、字幕、語音",
    status: "未設定",
    maskedKey: "尚未設定",
  },
  {
    id: "gemini",
    name: "Gemini",
    envKey: "GEMINI_API_KEY",
    purpose: "影片生成、視覺分析",
    status: "未設定",
    maskedKey: "尚未設定",
  },
  {
    id: "custom",
    name: "自訂 Provider",
    envKey: "CUSTOM_AI_PROVIDER_API_KEY",
    purpose: "Runway / Kling / Pika / Replicate",
    status: "未設定",
    maskedKey: "尚未設定",
  },
];

export const initialModelFeatures: ModelFeatureBinding[] = [
  {
    feature: "腳本生成",
    currentModel: "OpenAI GPT-5.2",
    fallbackModel: "Gemini 2.0 Pro",
    estimatedCost: "$0.018",
    status: "待設定",
  },
  {
    feature: "參考影片分析",
    currentModel: "OpenAI Vision",
    fallbackModel: "Gemini Vision",
    estimatedCost: "$0.026",
    status: "待設定",
  },
  {
    feature: "字幕生成",
    currentModel: "OpenAI Transcribe",
    fallbackModel: "Local ASR",
    estimatedCost: "$0.009",
    status: "待設定",
  },
  {
    feature: "影片生成",
    currentModel: "自訂 Provider",
    fallbackModel: "Gemini",
    estimatedCost: "$0.180",
    status: "待設定",
  },
];

export const initialSocialPlatforms: SocialPlatformBinding[] = [
  {
    id: "facebook",
    name: "Facebook",
    clientIdEnv: "FACEBOOK_CLIENT_ID",
    clientSecretEnv: "FACEBOOK_CLIENT_SECRET",
    scopes: ["pages_manage_posts", "pages_read_engagement", "pages_show_list"],
    status: "未設定",
    connectedCount: 0,
  },
  {
    id: "instagram",
    name: "Instagram",
    clientIdEnv: "INSTAGRAM_CLIENT_ID",
    clientSecretEnv: "INSTAGRAM_CLIENT_SECRET",
    scopes: [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list",
      "pages_read_engagement",
    ],
    status: "未設定",
    connectedCount: 0,
  },
  {
    id: "tiktok",
    name: "TikTok",
    clientIdEnv: "TIKTOK_CLIENT_ID",
    clientSecretEnv: "TIKTOK_CLIENT_SECRET",
    scopes: ["user.info.basic", "video.publish"],
    status: "未設定",
    connectedCount: 0,
  },
  {
    id: "youtube",
    name: "YouTube",
    clientIdEnv: "YOUTUBE_CLIENT_ID",
    clientSecretEnv: "YOUTUBE_CLIENT_SECRET",
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ],
    status: "未設定",
    connectedCount: 0,
  },
];

export const initialSocialAccounts: SocialAccountBinding[] = [];
