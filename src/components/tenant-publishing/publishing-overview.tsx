import { CalendarClock, CheckCircle2, FilePenLine, TriangleAlert } from "lucide-react";

import type { PublishingSchedule } from "@/types/integrations";

type PublishingOverviewProps = {
  schedules: PublishingSchedule[];
};

const overviewItems = [
  {
    key: "scheduled",
    label: "已排程",
    tone: "bg-blue-50 text-primary ring-blue-100",
    icon: CalendarClock,
  },
  {
    key: "published",
    label: "已發布",
    tone: "bg-emerald-50 text-success ring-emerald-100",
    icon: CheckCircle2,
  },
  {
    key: "drafts",
    label: "草稿",
    tone: "bg-amber-50 text-warning ring-amber-100",
    icon: FilePenLine,
  },
  {
    key: "failed",
    label: "失敗",
    tone: "bg-red-50 text-danger ring-red-100",
    icon: TriangleAlert,
  },
] as const;

export function PublishingOverview({ schedules }: PublishingOverviewProps) {
  const values = {
    scheduled: schedules.filter((schedule) => schedule.status === "已排程").length,
    published: schedules.filter((schedule) => schedule.status === "已發布").length,
    drafts: schedules.filter((schedule) => schedule.status === "草稿").length,
    failed: schedules.filter((schedule) => schedule.status === "失敗").length,
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {overviewItems.map((item) => {
        const Icon = item.icon;

        return (
          <article key={item.key} className="dashboard-card dashboard-card-hover">
            <span
              className={`inline-flex size-10 items-center justify-center rounded-2xl ring-1 ${item.tone}`}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 metric-label">{item.label}</p>
            <p className="mt-1 metric-value text-[28px]">{values[item.key]}</p>
          </article>
        );
      })}
    </section>
  );
}
