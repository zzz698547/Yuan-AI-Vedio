import { BarChart3, CheckCircle2, Link2, TriangleAlert } from "lucide-react";

import type { SocialAnalyticsStat } from "@/types/social-operations";

type AnalyticsSummaryCardsProps = {
  stats: SocialAnalyticsStat[];
};

const toneStyles: Record<SocialAnalyticsStat["tone"], string> = {
  blue: "bg-blue-50 text-primary ring-blue-100",
  green: "bg-emerald-50 text-success ring-emerald-100",
  orange: "bg-amber-50 text-warning ring-amber-100",
  red: "bg-red-50 text-danger ring-red-100",
};

const icons = [Link2, BarChart3, CheckCircle2, TriangleAlert];

export function AnalyticsSummaryCards({ stats }: AnalyticsSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] ?? BarChart3;

        return (
          <article key={stat.label} className="dashboard-card dashboard-card-hover">
            <span
              className={`inline-flex size-10 items-center justify-center rounded-2xl ring-1 ${toneStyles[stat.tone]}`}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 metric-label">{stat.label}</p>
            <p className="mt-1 metric-value text-[28px]">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {stat.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}
