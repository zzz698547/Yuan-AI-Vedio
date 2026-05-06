import { notificationEventOptions } from "@/data/notification-events";
import { maskSecret } from "@/lib/integration-service";
import type {
  NotificationEventId,
  TelegramSecret,
  TenantNotificationSettings,
} from "@/types/notification";

export type TenantNotificationState = {
  settings: TenantNotificationSettings;
  telegramSecret?: TelegramSecret;
};

export type NotificationPayload = {
  settings: TenantNotificationSettings;
  events: typeof notificationEventOptions;
};

export function createTenantNotificationState(
  tenantId: string
): TenantNotificationState {
  return {
    settings: {
      tenantId,
      telegram: {
        enabled: false,
        botTokenMasked: "尚未綁定",
        chatIdMasked: "尚未綁定",
      },
      enabledEvents: ["video-published", "ai-video-generated"],
      updatedAt: new Date().toISOString(),
    },
  };
}

export function getNotificationPayload(
  state: TenantNotificationState
): NotificationPayload {
  return {
    settings: state.settings,
    events: notificationEventOptions,
  };
}

export function bindTelegram(
  state: TenantNotificationState,
  payload: {
    botToken: string;
    chatId: string;
  }
) {
  const botToken = payload.botToken.trim();
  const chatId = payload.chatId.trim();

  if (botToken.length < 12 || chatId.length < 3) {
    throw new Error("請輸入有效的 Telegram Bot Token 與 Chat ID。");
  }

  state.telegramSecret = { botToken, chatId };
  state.settings = {
    ...state.settings,
    telegram: {
      enabled: true,
      botTokenMasked: maskSecret(botToken),
      chatIdMasked: maskSecret(chatId),
      boundAt: new Date().toISOString(),
      lastMessage: "Telegram 已手動綁定。",
    },
    updatedAt: new Date().toISOString(),
  };

  return getNotificationPayload(state);
}

export function updateNotificationEvents(
  state: TenantNotificationState,
  eventIds: NotificationEventId[]
) {
  const validIds = new Set(notificationEventOptions.map((event) => event.id));
  const nextEvents = eventIds.filter((eventId) => validIds.has(eventId));

  state.settings = {
    ...state.settings,
    enabledEvents: Array.from(new Set(nextEvents)),
    updatedAt: new Date().toISOString(),
  };

  return getNotificationPayload(state);
}

export async function sendTelegramTest(state: TenantNotificationState) {
  if (!state.telegramSecret || !state.settings.telegram.enabled) {
    throw new Error("請先完成 Telegram 手動綁定。");
  }

  await sendTelegramMessage(state.telegramSecret, buildTestMessage(state.settings));

  state.settings = {
    ...state.settings,
    telegram: {
      ...state.settings.telegram,
      lastTestedAt: new Date().toISOString(),
      lastMessage: "測試通知已成功送出。",
    },
    updatedAt: new Date().toISOString(),
  };

  return getNotificationPayload(state);
}

export async function sendTenantNotificationEvent(
  state: TenantNotificationState,
  payload: {
    eventId: NotificationEventId;
    title: string;
    detail: string;
  }
) {
  if (!state.settings.enabledEvents.includes(payload.eventId)) {
    return { sent: false, message: "此事件未啟用 Telegram 通知。" };
  }

  if (!state.telegramSecret || !state.settings.telegram.enabled) {
    return { sent: false, message: "Telegram 尚未綁定。" };
  }

  const event = notificationEventOptions.find((item) => item.id === payload.eventId);
  const text = [
    `<b>${escapeHtml(event?.title ?? payload.title)}</b>`,
    escapeHtml(payload.detail),
  ].join("\n");

  await sendTelegramMessage(state.telegramSecret, text);

  state.settings = {
    ...state.settings,
    telegram: {
      ...state.settings.telegram,
      lastTestedAt: new Date().toISOString(),
      lastMessage: "已送出 Telegram 事件通知。",
    },
    updatedAt: new Date().toISOString(),
  };

  return { sent: true, message: "Telegram 通知已送出。" };
}

function buildTestMessage(settings: TenantNotificationSettings) {
  const eventTitles = notificationEventOptions
    .filter((event) => settings.enabledEvents.includes(event.id))
    .map((event) => `• ${event.title}`)
    .join("\n");

  return [
    "<b>Veltrix AI 通知測試</b>",
    "Telegram 綁定成功，以下事件將會通知：",
    eventTitles || "尚未勾選通知事件",
  ].join("\n");
}

async function sendTelegramMessage(secret: TelegramSecret, text: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${secret.botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: secret.chatId,
        text,
        parse_mode: "HTML",
      }),
    }
  );
  const result = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    description?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram 回應 ${response.status}`);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
