"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CalendarClock, Send } from "lucide-react";

import { publishingActionNotes } from "@/data/social-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

type PublishingScheduleFormProps = {
  accounts: SocialAccountBinding[];
  platforms: SocialPlatformBinding[];
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function PublishingScheduleForm({
  accounts,
  platforms,
  isSubmitting,
  onSubmit,
}: PublishingScheduleFormProps) {
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatformId>("facebook");
  const readyAccounts = accounts.filter(
    (account) =>
      account.platform === selectedPlatform && account.tokenStatus === "正常"
  );
  const hasReadyAccounts = readyAccounts.length > 0;

  return (
    <section className="dashboard-card grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={onSubmit} className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="icon-bubble">
            <CalendarClock aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">新增發布排程</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              選擇已綁定帳號、填入素材資訊，系統會透過 API 建立排程。
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">影片標題</span>
            <Input
              name="title"
              placeholder="例如：新品上市 15 秒短片"
              className="h-11 rounded-[14px]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">平台</span>
            <select
              name="platform"
              value={selectedPlatform}
              onChange={(event) =>
                setSelectedPlatform(event.target.value as SocialPlatformId)
              }
              className="h-11 rounded-[14px] border border-border bg-white px-3 text-sm font-medium text-foreground"
            >
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">發布帳號</span>
            <select
              name="accountId"
              disabled={!hasReadyAccounts}
              className="h-11 rounded-[14px] border border-border bg-white px-3 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted-foreground"
            >
              {readyAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">發布時間</span>
            <Input
              name="publishAt"
              type="datetime-local"
              className="h-11 rounded-[14px]"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">貼文內容</span>
          <textarea
            name="caption"
            rows={4}
            placeholder="輸入要搭配影片發布的文案..."
            className="min-h-28 rounded-[14px] border border-border bg-white px-3 py-3 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">素材網址</span>
          <Input
            name="mediaUrl"
            placeholder="https://.../video.mp4 或素材雲端連結"
            className="h-11 rounded-[14px]"
          />
        </label>

        <Button
          type="submit"
          disabled={isSubmitting || !hasReadyAccounts}
          className="h-11 rounded-[14px]"
        >
          <Send data-icon="inline-start" />
          {isSubmitting ? "建立中..." : "建立排程"}
        </Button>

        {!hasReadyAccounts ? (
          <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-warning">
            此平台目前沒有可用帳號，請先到社群綁定完成授權或手動綁定。
          </p>
        ) : null}
      </form>

      <div className="rounded-2xl border border-border bg-slate-50 p-5">
        <h3 className="text-base font-bold text-foreground">真實執行條件</h3>
        <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {publishingActionNotes.map((note, index) => (
            <p key={note}>
              {index + 1}. {note}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
