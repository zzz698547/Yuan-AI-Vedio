import { parseApiResponse } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type {
  NotificationEventId,
  NotificationEventOption,
  TenantNotificationSettings,
} from "@/types/notification";

export type TenantNotificationPayload = {
  settings: TenantNotificationSettings;
  events: NotificationEventOption[];
};

export async function fetchTenantNotifications(tenantId: string) {
  const response = await fetch(
    `/api/tenant/notifications?tenantId=${encodeURIComponent(tenantId)}`
  );
  return parseApiResponse<TenantNotificationPayload>(response) as Promise<
    ApiResponse<TenantNotificationPayload>
  >;
}

export async function updateTenantNotificationEvents(payload: {
  tenantId: string;
  enabledEvents: NotificationEventId[];
}) {
  const response = await fetch("/api/tenant/notifications", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<TenantNotificationPayload>(response) as Promise<
    ApiResponse<TenantNotificationPayload>
  >;
}

export async function bindTenantTelegram(payload: {
  tenantId: string;
  botToken: string;
  chatId: string;
}) {
  const response = await fetch("/api/tenant/notifications/telegram/bind", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<TenantNotificationPayload>(response) as Promise<
    ApiResponse<TenantNotificationPayload>
  >;
}

export async function testTenantTelegram(tenantId: string) {
  const response = await fetch("/api/tenant/notifications/telegram/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tenantId }),
  });
  return parseApiResponse<TenantNotificationPayload>(response) as Promise<
    ApiResponse<TenantNotificationPayload>
  >;
}

export async function sendTenantNotificationEvent(payload: {
  tenantId: string;
  eventId: NotificationEventId;
  title: string;
  detail: string;
}) {
  const response = await fetch("/api/tenant/notifications/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<{ sent: boolean; message: string }>(response);
}
