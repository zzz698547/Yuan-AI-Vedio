"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { PublishingOverview } from "@/components/tenant-publishing/publishing-overview";
import { PublishingScheduleForm } from "@/components/tenant-publishing/publishing-schedule-form";
import { PublishingScheduleList } from "@/components/tenant-publishing/publishing-schedule-list";
import {
  createPublishingSchedule,
  deletePublishingSchedule,
  fetchPublishingSchedules,
  updatePublishingSchedule,
} from "@/lib/integrations-api";
import { getMockSession } from "@/lib/mock-auth";
import type {
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";
import type { ScheduleAction } from "@/types/social-operations";

export function SocialPublishingClient() {
  const [schedules, setSchedules] = useState<PublishingSchedule[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountBinding[]>([]);
  const [platforms, setPlatforms] = useState<SocialPlatformBinding[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingScheduleId, setPendingScheduleId] = useState("");

  async function loadPublishingData(shouldApply = () => true) {
    try {
      const result = await fetchPublishingSchedules();

      if (!shouldApply()) {
        return;
      }

      setSchedules(result.data.schedules);
      setAccounts(result.data.accounts);
      setPlatforms(result.data.platforms);
    } catch (loadError) {
      if (shouldApply()) {
        setError(
          loadError instanceof Error ? loadError.message : "排程資料載入失敗。"
        );
      }
    }
  }

  function resetMessage() {
    setNotice("");
    setError("");
  }

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      void loadPublishingData(() => isActive);
    });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const tenantId = getMockSession()?.tenantId || "default-tenant";

    setIsSubmitting(true);
    resetMessage();

    try {
      const result = await createPublishingSchedule({
        tenantId,
        title: String(formData.get("title") ?? ""),
        platform: String(formData.get("platform")) as SocialPlatformId,
        accountId: String(formData.get("accountId") ?? ""),
        caption: String(formData.get("caption") ?? ""),
        mediaUrl: String(formData.get("mediaUrl") ?? ""),
        publishAt: String(formData.get("publishAt") ?? ""),
      });
      setSchedules((current) => [result.data, ...current]);
      setNotice(result.message ?? `已建立排程：${result.data.title}`);
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "建立排程失敗。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleScheduleAction(
    scheduleId: string,
    action: ScheduleAction
  ) {
    setPendingScheduleId(scheduleId);
    resetMessage();

    try {
      const result = await updatePublishingSchedule(scheduleId, action);
      setSchedules((current) =>
        current.map((schedule) =>
          schedule.id === scheduleId ? result.data : schedule
        )
      );
      setNotice(result.message ?? "排程已更新。");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "排程更新失敗。");
    } finally {
      setPendingScheduleId("");
    }
  }

  async function handleDeleteSchedule(scheduleId: string) {
    if (!window.confirm("確定要刪除此排程嗎？")) {
      return;
    }

    setPendingScheduleId(scheduleId);
    resetMessage();

    try {
      const result = await deletePublishingSchedule(scheduleId);
      setSchedules(result.data.schedules);
      setAccounts(result.data.accounts);
      setPlatforms(result.data.platforms);
      setNotice(result.message ?? "排程已刪除。");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "刪除排程失敗。");
    } finally {
      setPendingScheduleId("");
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          排程發文
        </h1>
        <p className="text-sm font-medium leading-7 text-muted-foreground md:text-base">
          建立跨平台短影音排程，並透過 API 驗證社群帳號、Token 與發布權限。
        </p>
      </section>

      <PublishingOverview schedules={schedules} />

      {notice ? <StatusMessage tone="success" message={notice} /> : null}
      {error ? <StatusMessage tone="danger" message={error} /> : null}

      <PublishingScheduleForm
        accounts={accounts}
        platforms={platforms}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <PublishingScheduleList
        schedules={schedules}
        accounts={accounts}
        platforms={platforms}
        pendingScheduleId={pendingScheduleId}
        onAction={handleScheduleAction}
        onDelete={handleDeleteSchedule}
      />
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
