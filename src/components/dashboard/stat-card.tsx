import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCardColor = "blue" | "green" | "purple" | "orange" | "red";

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  changeType: "increase" | "decrease";
  icon: ReactNode;
  color: StatCardColor;
  className?: string;
};

const iconBubbleStyles: Record<StatCardColor, string> = {
  blue: "bg-[#EAF3FF] text-primary",
  green: "bg-emerald-50 text-success",
  purple: "bg-violet-50 text-[#8B5CF6]",
  orange: "bg-amber-50 text-warning",
  red: "bg-red-50 text-danger",
};

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  className,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "dashboard-card dashboard-card-hover flex min-h-[148px] items-start justify-between gap-5",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="metric-label truncate">{title}</p>
        <p className="metric-value">{value}</p>
        <p
          className={cn(
            "text-sm font-semibold",
            changeType === "increase" ? "text-success" : "text-danger"
          )}
        >
          {change}
        </p>
      </div>

      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
          iconBubbleStyles[color]
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
    </article>
  );
}
