import { ArrowRight, CheckCircle2, Clock3, Construction } from "lucide-react";

import type { RoutePlaceholder } from "@/data/route-placeholders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RoutePlaceholderPageProps = {
  page: RoutePlaceholder;
};

export function RoutePlaceholderPage({ page }: RoutePlaceholderPageProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit bg-[#EAF3FF] text-primary hover:bg-[#EAF3FF]">
          {page.statusLabel}
        </Badge>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground md:text-3xl">
            {page.title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="dashboard-card dashboard-card-hover p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="icon-bubble bg-[#EAF3FF] text-primary">
              <Construction className="size-5" />
            </span>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                頁面正在整理中
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                目前先保留清楚的空狀態，避免預覽點擊時進入 404。後續串接 API
                時，可以直接延伸這個頁面。
              </p>
            </div>
          </div>

          <Button className="w-fit rounded-[14px] bg-primary text-primary-foreground hover:bg-primary/90">
            {page.primaryAction}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {page.tasks.map((task) => (
            <div
              key={task}
              className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50/80 p-4 text-sm font-medium text-foreground"
            >
              <CheckCircle2 className="size-4 text-success" />
              {task}
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card p-5">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock3 className="size-4 text-warning" />
          目前使用 mock 狀態，不需要環境變數或真實 API。
        </div>
      </div>
    </section>
  );
}
