import type { FacebookLoginUiStatus } from "@/types/facebook-sdk";

export const facebookLoginStatusCopy: Record<
  FacebookLoginUiStatus,
  {
    badge: string;
    description: string;
    label: string;
    toneClass: string;
  }
> = {
  checking: {
    badge: "檢查中",
    description: "正在向 Facebook 取得目前登入狀態。",
    label: "正在檢查 Facebook 登入狀態",
    toneClass: "border-blue-100 bg-blue-50 text-primary",
  },
  connected: {
    badge: "已連線",
    description: "用戶已登入 Facebook，且已授權此應用程式。",
    label: "Facebook 與應用程式皆已登入",
    toneClass: "border-green-100 bg-green-50 text-success",
  },
  not_authorized: {
    badge: "待授權",
    description: "用戶已登入 Facebook，但尚未授權 Veltrix AI 應用程式。",
    label: "尚未授權此應用程式",
    toneClass: "border-orange-100 bg-orange-50 text-warning",
  },
  unknown: {
    badge: "未登入",
    description: "用戶未登入 Facebook，或 Facebook 無法確認目前狀態。",
    label: "Facebook 登入狀態未知",
    toneClass: "border-slate-200 bg-slate-50 text-muted-foreground",
  },
  not_configured: {
    badge: "未設定",
    description: "請先設定 NEXT_PUBLIC_FACEBOOK_APP_ID 才能啟用 JS SDK。",
    label: "Facebook App ID 尚未設定",
    toneClass: "border-slate-200 bg-slate-50 text-muted-foreground",
  },
};
