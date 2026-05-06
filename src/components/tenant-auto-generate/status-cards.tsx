import {
  CalendarCheck,
  Clock3,
  FileVideo,
  RadioTower,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { TenantAutomationState } from "@/types/tenant-automation";

type StatusCardsProps = {
  state: TenantAutomationState;
};

const toneClasses = {
  blue: "bg-[#EAF3FF] text-[var(--primary)]",
  green: "bg-green-50 text-[var(--success)]",
  orange: "bg-orange-50 text-[var(--warning)]",
  purple: "bg-violet-50 text-[#8B5CF6]",
} as const;

export function StatusCards({ state }: StatusCardsProps) {
  const todayCount = state.candidateVideos.length;
  const reviewCount = state.candidateVideos.filter(
    (video) => video.status === "待審核"
  ).length;
  const scheduledCount = state.candidateVideos.filter(
    (video) => video.status === "已排程"
  ).length;
  const cards = [
    {
      title: "今日已產出",
      value: String(todayCount),
      hint: todayCount === 0 ? "尚未執行產出" : "由 API 真實產生",
      icon: FileVideo,
      color: "blue",
    },
    {
      title: "待審核",
      value: String(reviewCount),
      hint: "等待內容團隊確認",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "已排程",
      value: String(scheduledCount),
      hint: "已通過狀態更新",
      icon: CalendarCheck,
      color: "green",
    },
    {
      title: "自動化狀態",
      value: state.settings.enabled ? "啟用中" : "未啟用",
      hint: "由設定 API 控制",
      icon: RadioTower,
      color: "purple",
    },
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="dashboard-card dashboard-card-hover p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {card.value}
              </p>
              <p className="mt-2 text-xs font-medium text-slate-400">
                {card.hint}
              </p>
            </div>
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                toneClasses[card.color]
              )}
            >
              <card.icon aria-hidden="true" className="size-5" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
