import { BrainCircuit, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tenantAiMetrics } from "@/data/tenant-ai-models";
import type { TenantAiMetricTone } from "@/types/tenant-ai-model";

type TenantAiModelsHeaderProps = {
  isLoading: boolean;
  onRefresh: () => void;
};

const metricToneStyles: Record<TenantAiMetricTone, string> = {
  blue: "bg-blue-50 text-primary ring-blue-100",
  green: "bg-emerald-50 text-success ring-emerald-100",
  purple: "bg-violet-50 text-violet-600 ring-violet-100",
  orange: "bg-amber-50 text-warning ring-amber-100",
};

export function TenantAiModelsHeader({
  isLoading,
  onRefresh,
}: TenantAiModelsHeaderProps) {
  return (
    <section className="flex flex-col gap-3">
      <Badge variant="info" className="w-fit rounded-full px-3 py-1 text-xs font-bold">
        AI 模型綁定
      </Badge>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            租戶 AI 模型綁定
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-muted-foreground md:text-base">
            綁定 OpenAI 與 Gemini，讓此租戶工作區可獨立管理腳本生成、參考影片分析、
            字幕與自動剪輯的模型路由。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={onRefresh}
          className="h-10 rounded-xl"
        >
          <RefreshCw data-icon="inline-start" />
          重新整理
        </Button>
      </div>
    </section>
  );
}

export function TenantAiMetricCards() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tenantAiMetrics.map((metric) => (
        <article key={metric.label} className="dashboard-card dashboard-card-hover">
          <span
            className={`inline-flex size-10 items-center justify-center rounded-2xl ring-1 ${metricToneStyles[metric.tone]}`}
          >
            <BrainCircuit aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-4 metric-label">{metric.label}</p>
          <p className="mt-1 metric-value text-[28px]">{metric.value}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {metric.description}
          </p>
        </article>
      ))}
    </section>
  );
}
