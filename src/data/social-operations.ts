import type { SocialPlatformId } from "@/types/integrations";

export type SocialPlatformMeta = {
  id: SocialPlatformId;
  label: string;
  shortLabel: string;
  tone: "blue" | "pink" | "slate" | "red";
};

export const socialPlatformMeta: SocialPlatformMeta[] = [
  {
    id: "facebook",
    label: "Facebook",
    shortLabel: "FB",
    tone: "blue",
  },
  {
    id: "instagram",
    label: "Instagram",
    shortLabel: "IG",
    tone: "pink",
  },
  {
    id: "tiktok",
    label: "TikTok",
    shortLabel: "TT",
    tone: "slate",
  },
  {
    id: "youtube",
    label: "YouTube",
    shortLabel: "YT",
    tone: "red",
  },
];

export const publishingActionNotes = [
  "建立排程前必須先綁定同平台帳號。",
  "立即發布會驗證帳號 token 與發文權限，再更新排程狀態。",
  "若平台 OAuth 或 token 無效，API 會回傳錯誤並保留排程。",
];
