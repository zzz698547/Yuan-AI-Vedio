import { scheduleDays } from "@/data/mock-admin";
import { cn } from "@/lib/utils";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const calendarCells = [
  ...Array.from({ length: 5 }, () => null),
  ...Array.from({ length: 31 }, (_, index) => index + 1),
];

const typeStyles = {
  scheduled: "bg-primary",
  published: "bg-success",
  draft: "bg-warning",
} as const;

const legend = [
  { label: "已排程", className: "bg-primary" },
  { label: "已發布", className: "bg-success" },
  { label: "草稿", className: "bg-warning" },
];

function getDayType(day: number) {
  const date = `2026-05-${String(day).padStart(2, "0")}`;
  return scheduleDays.find((item) => item.date === date)?.type;
}

export function ScheduleCalendarCard() {
  return (
    <section className="dashboard-card">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        排程發布日曆
      </h2>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">2026 年 5 月</p>
        <p className="text-xs text-muted-foreground">發布排程總覽</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {calendarCells.map((day, index) => {
          const type = day ? getDayType(day) : undefined;

          return (
            <div
              key={`${day ?? "empty"}-${index}`}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold",
                day
                  ? "bg-slate-50 text-foreground"
                  : "bg-transparent text-transparent"
              )}
            >
              {day}
              {type ? (
                <span
                  className={cn(
                    "absolute bottom-2 size-1.5 rounded-full",
                    typeStyles[type]
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", item.className)} />
            <span className="text-xs font-medium text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
