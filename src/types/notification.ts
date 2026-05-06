export type NotificationEventId =
  | "video-published"
  | "ai-video-generated"
  | "schedule-failed"
  | "token-expiring"
  | "quota-warning"
  | "review-required";

export type NotificationEventOption = {
  id: NotificationEventId;
  title: string;
  description: string;
};

export type TelegramBinding = {
  enabled: boolean;
  botTokenMasked: string;
  chatIdMasked: string;
  boundAt?: string;
  lastTestedAt?: string;
  lastMessage?: string;
};

export type TelegramSecret = {
  botToken: string;
  chatId: string;
};

export type TenantNotificationSettings = {
  tenantId: string;
  telegram: TelegramBinding;
  enabledEvents: NotificationEventId[];
  updatedAt: string;
};
