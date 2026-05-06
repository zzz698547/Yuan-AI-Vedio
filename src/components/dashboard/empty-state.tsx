import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  icon?: LucideIcon;
};

export function EmptyState({
  title,
  description,
  actionLabel = "即將開放",
  icon: Icon = Sparkles,
}: EmptyStateProps) {
  return (
    <section className="dashboard-card overflow-hidden p-0">
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_280px] md:p-8">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF3FF] text-primary">
            <Icon aria-hidden="true" className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="h-10 rounded-[14px] px-4" disabled>
              {actionLabel}
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-[14px] border-border bg-white px-4 text-muted-foreground"
              disabled
            >
              查看文件
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] border border-border bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-5/6" />
          </div>
        </div>
      </div>
    </section>
  );
}
