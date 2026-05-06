"use client";

import { useState } from "react";
import { CalendarClock, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPublishingSchedule } from "@/lib/integrations-api";
import { getMockSession } from "@/lib/mock-auth";
import type { SocialPlatformId } from "@/types/integrations";

const platformOptions: Array<{ label: string; value: SocialPlatformId }> = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
];

export function SocialPublishingClient() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tenantId = getMockSession()?.tenantId || "default-tenant";
    const platform = String(formData.get("platform")) as SocialPlatformId;

    setIsSubmitting(true);
    setNotice("");
    setError("");

    try {
      const result = await createPublishingSchedule({
        tenantId,
        title: String(formData.get("title") ?? ""),
        platform,
        publishAt: String(formData.get("publishAt") ?? ""),
      });
      setNotice(result.message ?? `已建立排程：${result.data.title}`);
      event.currentTarget.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "建立排程失敗。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          排程發文
        </h1>
        <p className="text-sm font-medium text-muted-foreground md:text-base">
          建立排程會呼叫 API，並要求社群 OAuth 已完成才允許排程。
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

      <section className="dashboard-card grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-bubble">
              <CalendarClock aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">新增真實排程</h2>
              <p className="text-sm text-muted-foreground">
                若社群平台尚未 OAuth 綁定，API 會拒絕建立。
              </p>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">影片標題</span>
            <Input name="title" placeholder="輸入要發布的影片標題" className="h-11 rounded-[14px]" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">平台</span>
            <select
              name="platform"
              className="h-11 rounded-[14px] border border-border bg-white px-3 text-sm font-medium text-foreground"
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">發布時間</span>
            <Input name="publishAt" type="datetime-local" className="h-11 rounded-[14px]" />
          </label>

          <Button type="submit" disabled={isSubmitting} className="h-11 rounded-[14px]">
            <Send data-icon="inline-start" />
            {isSubmitting ? "建立中..." : "建立排程"}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-slate-50 p-5">
          <h3 className="text-base font-bold text-foreground">真實執行條件</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>1. 先在管理員後台完成社群 OAuth 環境變數設定。</p>
            <p>2. 完成平台 callback 並取得可發文 token。</p>
            <p>3. 排程 API 才會接受任務並進入已排程狀態。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
