"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { NotificationEventList } from "@/components/tenant-notifications/notification-event-list";
import { TelegramBindCard } from "@/components/tenant-notifications/telegram-bind-card";
import { getMockSession } from "@/lib/mock-auth";
import {
  bindTenantTelegram,
  fetchTenantNotifications,
  testTenantTelegram,
  updateTenantNotificationEvents,
  type TenantNotificationPayload,
} from "@/lib/tenant-notifications-api";
import type {
  NotificationEventId,
  NotificationEventOption,
  TenantNotificationSettings,
} from "@/types/notification";

const defaultSettings: TenantNotificationSettings = {
  tenantId: "tenant-demo",
  telegram: {
    enabled: false,
    botTokenMasked: "尚未綁定",
    chatIdMasked: "尚未綁定",
  },
  enabledEvents: [],
  updatedAt: "",
};

export function TenantNotificationsClient() {
  const [settings, setSettings] = useState(defaultSettings);
  const [events, setEvents] = useState<NotificationEventOption[]>([]);
  const [draftEvents, setDraftEvents] = useState<NotificationEventId[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isBinding, setIsBinding] = useState(false);
  const [isSavingEvents, setIsSavingEvents] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const tenantId = getTenantId();

  useEffect(() => {
    let isActive = true;

    queueMicrotask(async () => {
      try {
        const result = await fetchTenantNotifications(tenantId);

        if (!isActive) {
          return;
        }

        setSettings(result.data.settings);
        setEvents(result.data.events);
        setDraftEvents(result.data.settings.enabledEvents);
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "通知設定載入失敗。");
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [tenantId]);

  async function handleBind(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsBinding(true);
    resetMessage();

    try {
      const result = await bindTenantTelegram({
        tenantId,
        botToken: String(formData.get("botToken") ?? ""),
        chatId: String(formData.get("chatId") ?? ""),
      });
      applyPayload(result.data);
      setNotice(result.message ?? "Telegram 已手動綁定。");
      event.currentTarget.reset();
    } catch (bindError) {
      setError(bindError instanceof Error ? bindError.message : "Telegram 綁定失敗。");
    } finally {
      setIsBinding(false);
    }
  }

  async function handleSaveEvents() {
    setIsSavingEvents(true);
    resetMessage();

    try {
      const result = await updateTenantNotificationEvents({
        tenantId,
        enabledEvents: draftEvents,
      });
      applyPayload(result.data);
      setNotice(result.message ?? "通知事件設定已更新。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "通知事件儲存失敗。");
    } finally {
      setIsSavingEvents(false);
    }
  }

  async function handleTestTelegram() {
    setIsTesting(true);
    resetMessage();

    try {
      const result = await testTenantTelegram(tenantId);
      applyPayload(result.data);
      setNotice(result.message ?? "Telegram 測試通知已送出。");
    } catch (testError) {
      setError(testError instanceof Error ? testError.message : "Telegram 測試失敗。");
    } finally {
      setIsTesting(false);
    }
  }

  function handleToggle(eventId: NotificationEventId) {
    setDraftEvents((current) =>
      current.includes(eventId)
        ? current.filter((item) => item !== eventId)
        : [...current, eventId]
    );
  }

  function applyPayload(payload: TenantNotificationPayload) {
    setSettings(payload.settings);
    setEvents(payload.events);
    setDraftEvents(payload.settings.enabledEvents);
  }

  function resetMessage() {
    setNotice("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          通知設定
        </h1>
        <p className="text-sm font-medium leading-7 text-muted-foreground md:text-base">
          勾選工作區事件並手動綁定 Telegram，AI 生成完成或影片發布成功時即可通知團隊。
        </p>
      </section>

      {notice ? <StatusMessage tone="success" message={notice} /> : null}
      {error ? <StatusMessage tone="danger" message={error} /> : null}

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <TelegramBindCard
          telegram={settings.telegram}
          isBinding={isBinding}
          isTesting={isTesting}
          onBind={handleBind}
          onTest={handleTestTelegram}
        />
        <NotificationEventList
          events={events}
          enabledEvents={draftEvents}
          isSaving={isSavingEvents}
          onToggle={handleToggle}
          onSave={handleSaveEvents}
        />
      </section>
    </div>
  );
}

function StatusMessage({
  tone,
  message,
}: {
  tone: "success" | "danger";
  message: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-green-100 bg-green-50 text-success"
      : "border-red-100 bg-red-50 text-danger";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass}`}>
      {message}
    </div>
  );
}

function getTenantId() {
  return getMockSession()?.tenantId || "tenant-demo";
}
