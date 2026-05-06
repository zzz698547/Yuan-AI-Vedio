"use client";

import { FilePenLine, Send, Trash2, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  PublishingSchedule,
  SocialAccountBinding,
  SocialPlatformBinding,
} from "@/types/integrations";
import type { ScheduleAction } from "@/types/social-operations";

type PublishingScheduleListProps = {
  schedules: PublishingSchedule[];
  accounts: SocialAccountBinding[];
  platforms: SocialPlatformBinding[];
  pendingScheduleId: string;
  onAction: (scheduleId: string, action: ScheduleAction) => void;
  onDelete: (scheduleId: string) => void;
};

export function PublishingScheduleList({
  schedules,
  accounts,
  platforms,
  pendingScheduleId,
  onAction,
  onDelete,
}: PublishingScheduleListProps) {
  return (
    <section className="dashboard-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            發布排程清單
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            可立即發布、移回草稿、標記失敗或刪除排程。
          </p>
        </div>
        <Badge variant="info" className="w-fit rounded-full">
          共 {schedules.length} 筆
        </Badge>
      </div>

      <div className="mt-5 grid gap-3">
        {schedules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center">
            <p className="font-semibold text-foreground">尚未建立排程</p>
            <p className="mt-2 text-sm text-muted-foreground">
              綁定社群帳號後，就能在上方建立第一筆跨平台發布排程。
            </p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <article
              key={schedule.id}
              className="grid min-w-0 gap-4 rounded-2xl border border-border bg-white p-4 xl:grid-cols-[1.5fr_1fr_auto]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(schedule.status)}>
                    {schedule.status}
                  </Badge>
                  <Badge variant="outline">
                    {getPlatformName(schedule.platform, platforms)}
                  </Badge>
                </div>
                <h3 className="mt-3 break-words text-base font-bold text-foreground">
                  {schedule.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {schedule.caption || "尚未填寫貼文內容。"}
                </p>
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground">
                <MetaLine label="發布帳號" value={getAccountName(schedule, accounts)} />
                <MetaLine label="發布時間" value={formatDateTime(schedule.publishAt)} />
                <MetaLine label="素材網址" value={schedule.mediaUrl || "未填寫"} />
                {schedule.errorMessage ? (
                  <p className="break-words rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-danger">
                    {schedule.errorMessage}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:w-52 xl:grid-cols-1">
                <Button
                  type="button"
                  disabled={pendingScheduleId === schedule.id}
                  onClick={() => onAction(schedule.id, "publish")}
                  className="h-9 rounded-xl"
                >
                  <Send data-icon="inline-start" />
                  發布
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pendingScheduleId === schedule.id}
                  onClick={() => onAction(schedule.id, "draft")}
                  className="h-9 rounded-xl"
                >
                  <FilePenLine data-icon="inline-start" />
                  草稿
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pendingScheduleId === schedule.id}
                  onClick={() => onAction(schedule.id, "fail")}
                  className="h-9 rounded-xl text-warning"
                >
                  <TriangleAlert data-icon="inline-start" />
                  失敗
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pendingScheduleId === schedule.id}
                  onClick={() => onDelete(schedule.id)}
                  className="h-9 rounded-xl"
                >
                  <Trash2 data-icon="inline-start" />
                  刪除
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="min-w-0">
      <span className="font-semibold text-foreground">{label}：</span>
      <span className="break-words">{value}</span>
    </p>
  );
}

function getPlatformName(
  platformId: PublishingSchedule["platform"],
  platforms: SocialPlatformBinding[]
) {
  return platforms.find((platform) => platform.id === platformId)?.name ?? platformId;
}

function getAccountName(
  schedule: PublishingSchedule,
  accounts: SocialAccountBinding[]
) {
  return (
    accounts.find((account) => account.id === schedule.accountId)?.accountName ??
    "尚未選擇"
  );
}

function getStatusVariant(status: PublishingSchedule["status"]) {
  if (status === "已發布") {
    return "success";
  }

  if (status === "失敗") {
    return "danger";
  }

  if (status === "草稿") {
    return "warning";
  }

  return "info";
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
