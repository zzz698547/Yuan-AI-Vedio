import { CheckCircle2, CircleAlert, Flame, Gauge, Lightbulb } from "lucide-react";

import { SectionTitle } from "@/components/tenant-auto-generate/section-title";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TenantTrendRadar } from "@/types/tenant-automation";

type InsightsSidebarProps = {
  trends: TenantTrendRadar[];
  suggestions: string[];
};

const progressTone = {
  blue: "[&_[data-slot=progress-indicator]]:bg-[#2F80ED]",
  green: "[&_[data-slot=progress-indicator]]:bg-[#22C55E]",
  purple: "[&_[data-slot=progress-indicator]]:bg-[#8B5CF6]",
  orange: "[&_[data-slot=progress-indicator]]:bg-[#F59E0B]",
} as const;

export function InsightsSidebar({ trends, suggestions }: InsightsSidebarProps) {
  return (
    <aside className="min-w-0 space-y-6 xl:col-span-4">
      <section className="dashboard-card p-5 md:p-6">
        <SectionTitle
          icon={Flame}
          title="熱門趨勢雷達"
          description="產生候選影片後，雷達資料會由 API 更新。"
        />
        <div className="mt-6 space-y-5">
          {trends.map((trend) => (
            <div key={trend.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  {trend.label}
                </span>
                <span className="text-sm font-bold text-slate-950">
                  {trend.value}
                </span>
              </div>
              <Progress
                value={trend.value}
                className={cn(
                  "gap-0 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-slate-100",
                  progressTone[trend.color]
                )}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-card bg-gradient-to-br from-[#EAF3FF] via-white to-white p-5 md:p-6">
        <SectionTitle
          icon={Lightbulb}
          title="AI 建議"
          description="根據目前設定與候選影片產生。"
        />
        <div className="mt-6 space-y-4">
          {suggestions.length === 0 ? (
            <p className="rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-6 text-slate-500">
              尚無建議。完成設定並產生候選影片後，系統會給出策略建議。
            </p>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_10px_24px_rgba(47,128,237,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-sm font-bold text-[var(--primary)]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {suggestion}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-5 h-11 w-full rounded-[14px] border-blue-100 bg-white text-[var(--primary)] hover:bg-[#F4F9FF]"
        >
          套用今日建議
        </Button>
      </section>

      <section className="dashboard-card p-5 md:p-6">
        <SectionTitle
          icon={Gauge}
          title="安全檢查"
          description="所有自動排程前都必須通過內容 guardrail。"
        />
        <div className="mt-6 space-y-3">
          {[
            ["授權素材檢查", "通過", CheckCircle2, "green"],
            ["高風險詞彙", "未發現", CheckCircle2, "green"],
            ["相似度檢查", "需複核", CircleAlert, "orange"],
          ].map(([label, status, Icon, color]) => (
            <div
              key={label as string}
              className="flex items-center justify-between rounded-2xl border border-[#E5EAF3] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    color === "green"
                      ? "bg-green-50 text-[var(--success)]"
                      : "bg-orange-50 text-[var(--warning)]"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {label as string}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {status as string}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
