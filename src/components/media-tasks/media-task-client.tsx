"use client";

import { useState } from "react";
import {
  Clapperboard,
  FileVideo,
  Play,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMediaTask } from "@/lib/integrations-api";
import { getMockSession } from "@/lib/mock-auth";
import type { MediaTask, MediaTaskType } from "@/types/integrations";

type MediaTaskClientProps = {
  type: MediaTaskType;
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  actionLabel: string;
  iconName?: "play" | "clapperboard" | "file-video";
};

const iconMap = {
  play: Play,
  clapperboard: Clapperboard,
  "file-video": FileVideo,
};

export function MediaTaskClient({
  type,
  title,
  description,
  inputLabel,
  inputPlaceholder,
  actionLabel,
  iconName,
}: MediaTaskClientProps) {
  const Icon = iconName ? iconMap[iconName] : WandSparkles;
  const [task, setTask] = useState<MediaTask | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tenantId = getMockSession()?.tenantId || "default-tenant";

    setIsSubmitting(true);
    setNotice("");
    setError("");

    try {
      const result = await createMediaTask({
        tenantId,
        type,
        title: String(formData.get("title") ?? title),
        input: String(formData.get("input") ?? ""),
      });
      setTask(result.data);
      setNotice(result.message ?? "任務已執行。");
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "任務執行失敗。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8E8FF] bg-[#EAF3FF] px-3 py-1 text-xs font-semibold text-primary">
          <Icon aria-hidden="true" className="size-3.5" />
          Real Task API
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="text-sm font-medium leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-success">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="dashboard-card flex flex-col gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">任務標題</span>
            <Input
              name="title"
              defaultValue={title}
              className="h-11 rounded-[14px]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              {inputLabel}
            </span>
            <Input
              name="input"
              placeholder={inputPlaceholder}
              className="h-11 rounded-[14px]"
            />
          </label>
          <Button type="submit" disabled={isSubmitting} className="h-11 rounded-[14px]">
            <WandSparkles data-icon="inline-start" />
            {isSubmitting ? "執行中..." : actionLabel}
          </Button>
        </form>

        <div className="dashboard-card">
          <h2 className="text-lg font-bold text-foreground">任務結果</h2>
          {task ? (
            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-sm font-semibold text-foreground">
                狀態：{task.status}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {task.output}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                任務 ID：{task.id}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-slate-50 p-6 text-sm leading-7 text-muted-foreground">
              尚未執行任務。送出後會呼叫 `/api/media-tasks` 並回傳真實任務結果。
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
