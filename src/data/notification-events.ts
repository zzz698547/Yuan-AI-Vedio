import type { NotificationEventOption } from "@/types/notification";

export const notificationEventOptions: NotificationEventOption[] = [
  {
    id: "video-published",
    title: "成功發布影片",
    description: "排程影片成功發布到社群平台時通知 Telegram。",
  },
  {
    id: "ai-video-generated",
    title: "AI 生成影片完成",
    description: "AI 影片生成、字幕與輸出完成後通知團隊。",
  },
  {
    id: "schedule-failed",
    title: "排程發布失敗",
    description: "任何平台發布失敗或 token 失效時立即通知。",
  },
  {
    id: "token-expiring",
    title: "社群 Token 即將過期",
    description: "社群授權快到期，需要重新授權時通知。",
  },
  {
    id: "quota-warning",
    title: "使用額度過低",
    description: "AI 生成額度低於安全值時提醒團隊補充方案。",
  },
  {
    id: "review-required",
    title: "影片需要人工審核",
    description: "AI 判定內容需人工確認時發出提醒。",
  },
];
