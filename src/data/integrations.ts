import type {
  AiProviderBinding,
  ModelFeatureBinding,
  SocialAccountBinding,
  SocialPlatformBinding,
} from "@/types/integrations";
import { tenantAiModelFeatures } from "@/data/tenant-ai-models";

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

export const initialModelFeatures: ModelFeatureBinding[] =
  tenantAiModelFeatures.map((feature) => ({ ...feature }));

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
