import { CalendarDays, ChevronDown, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ScheduleStatus = "已排程" | "已發布" | "草稿" | "失敗";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const calendarCells = [
  ...Array.from({ length: 5 }, () => null),
  ...Array.from({ length: 31 }, (_, index) => index + 1),
];

const schedules = [
  {
    date: "2026-05-01",
    title: "五月新品短影音",
    tenant: "晨星行銷科技",
    platform: "FB",
    time: "09:30",
    status: "已發布",
  },
  {
    date: "2026-05-02",
    title: "母親節活動預告",
    tenant: "藍海電商股份有限公司",
    platform: "IG",
    time: "12:00",
    status: "已排程",
  },
  {
    date: "2026-05-03",
    title: "課程招生短片",
    tenant: "橙點教育平台",
    platform: "TikTok",
    time: "18:30",
    status: "草稿",
  },
  {
    date: "2026-05-06",
    title: "房仲開箱精華",
    tenant: "迅捷不動產科技",
    platform: "YouTube",
    time: "10:00",
    status: "已排程",
  },
  {
    date: "2026-05-06",
    title: "餐飲品牌新品介紹",
    tenant: "好食品牌顧問",
    platform: "IG",
    time: "14:00",
    status: "已排程",
  },
  {
    date: "2026-05-06",
    title: "企業功能亮點",
    tenant: "晨星行銷科技",
    platform: "FB",
    time: "16:30",
    status: "失敗",
  },
  {
    date: "2026-05-09",
    title: "直播精華剪輯",
    tenant: "拾光影像工作室",
    platform: "YouTube",
    time: "20:00",
    status: "已發布",
  },
  {
    date: "2026-05-13",
    title: "熱銷商品 Top 5",
    tenant: "藍海電商股份有限公司",
    platform: "TikTok",
    time: "11:30",
    status: "已排程",
  },
  {
    date: "2026-05-18",
    title: "品牌故事短片",
    tenant: "好食品牌顧問",
    platform: "FB",
    time: "15:45",
    status: "草稿",
  },
  {
    date: "2026-05-23",
    title: "週末活動回顧",
    tenant: "晨星行銷科技",
    platform: "IG",
    time: "19:00",
    status: "已發布",
  },
] as const satisfies ReadonlyArray<{
  date: string;
  title: string;
  tenant: string;
  platform: string;
  time: string;
  status: ScheduleStatus;
}>;

const statusStyles: Record<ScheduleStatus, string> = {
  已排程: "bg-blue-50 text-primary ring-blue-100",
  已發布: "bg-emerald-50 text-success ring-emerald-100",
  草稿: "bg-amber-50 text-warning ring-amber-100",
  失敗: "bg-red-50 text-danger ring-red-100",
};

const platformStyles: Record<string, string> = {
  FB: "bg-blue-50 text-blue-700",
  IG: "bg-pink-50 text-pink-700",
  TikTok: "bg-slate-100 text-slate-800",
  YouTube: "bg-red-50 text-red-700",
};

function FilterButton({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-11 justify-between rounded-[14px] border-border bg-white px-4 text-muted-foreground"
          />
        }
      >
        {label}
        <ChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-44">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getSchedulesByDay(day: number) {
  const date = `2026-05-${String(day).padStart(2, "0")}`;
  return schedules.filter((schedule) => schedule.date === date);
}

const todaySchedules = schedules.filter((schedule) => schedule.date === "2026-05-06");
const upcomingSchedules = schedules.filter((schedule) => schedule.status === "已排程");
const failedSchedules = schedules.filter((schedule) => schedule.status === "失敗");
const publishedSchedules = schedules.filter((schedule) => schedule.status === "已發布");

export default function AdminSchedulesPage() {
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          排程發文
        </h1>
        <p className="text-sm font-medium text-muted-foreground md:text-base">
          管理所有租戶的跨平台短影音排程
        </p>
      </section>

      <section className="dashboard-card flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-bubble">
            <CalendarDays aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">2026 年 5 月</p>
            <p className="text-xs text-muted-foreground">跨平台發文排程總覽</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
          <FilterButton
            label="月份切換"
            options={["2026 年 5 月", "2026 年 6 月", "2026 年 7 月"]}
          />
          <FilterButton
            label="平台篩選"
            options={["全部平台", "FB", "IG", "TikTok", "YouTube"]}
          />
          <FilterButton
            label="租戶篩選"
            options={["全部租戶", "晨星行銷科技", "藍海電商", "好食品牌顧問"]}
          />
          <Button className="h-11 rounded-[14px] px-4">
            <Plus data-icon="inline-start" />
            新增排程
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="dashboard-card overflow-hidden xl:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              2026 年 5 月
            </h2>
            <div className="flex flex-wrap gap-3">
              {(["已排程", "已發布", "草稿", "失敗"] as ScheduleStatus[]).map(
                (status) => (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        status === "已排程" && "bg-primary",
                        status === "已發布" && "bg-success",
                        status === "草稿" && "bg-warning",
                        status === "失敗" && "bg-danger"
                      )}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {status}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-border bg-white">
            <div className="grid grid-cols-7 border-b border-border bg-slate-50">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="px-3 py-3 text-center text-xs font-bold text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarCells.map((day, index) => {
                const daySchedules = day ? getSchedulesByDay(day) : [];

                return (
                  <div
                    key={`${day ?? "empty"}-${index}`}
                  className="min-w-0 border-b border-r border-border p-1.5 last:border-r-0 min-h-24 md:min-h-32 md:p-2"
                  >
                    {day ? (
                      <>
                        <div className="mb-2 text-sm font-bold text-foreground">
                          {day}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {daySchedules.slice(0, 3).map((schedule) => (
                            <div
                              key={`${schedule.title}-${schedule.time}`}
                              className="min-w-0 rounded-lg bg-slate-50 p-1.5"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "max-w-full truncate rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                                    platformStyles[schedule.platform]
                                  )}
                                >
                                  {schedule.platform}
                                </span>
                                <span
                                  className={cn(
                                    "size-2 rounded-full",
                                    schedule.status === "已排程" && "bg-primary",
                                    schedule.status === "已發布" && "bg-success",
                                    schedule.status === "草稿" && "bg-warning",
                                    schedule.status === "失敗" && "bg-danger"
                                  )}
                                />
                              </div>
                              <p className="mt-1 truncate text-[11px] font-semibold text-foreground">
                                {schedule.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-card xl:col-span-4">
          <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
            今日排程清單
          </h2>
          <div className="flex flex-col gap-3">
            {todaySchedules.map((schedule) => (
              <article
                key={`${schedule.title}-${schedule.time}`}
                className="rounded-2xl border border-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {schedule.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {schedule.tenant}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                      statusStyles[schedule.status]
                    )}
                  >
                    {schedule.status}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs font-bold",
                      platformStyles[schedule.platform]
                    )}
                  >
                    {schedule.platform}
                  </span>
                  <span className="font-semibold text-foreground">
                    {schedule.time}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-card overflow-hidden">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
          發布狀態總覽
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>分類</TableHead>
                <TableHead>影片標題</TableHead>
                <TableHead>租戶名稱</TableHead>
                <TableHead>平台</TableHead>
                <TableHead>發布時間</TableHead>
                <TableHead>狀態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...upcomingSchedules, ...failedSchedules, ...publishedSchedules].map(
                (schedule) => (
                  <TableRow key={`${schedule.date}-${schedule.title}`}>
                    <TableCell className="font-semibold text-foreground">
                      {schedule.status === "已排程"
                        ? "即將發布"
                        : schedule.status === "失敗"
                          ? "發布失敗"
                          : "已發布"}
                    </TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {schedule.tenant}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-lg px-2 py-1 text-xs font-bold",
                          platformStyles[schedule.platform]
                        )}
                      >
                        {schedule.platform}
                      </span>
                    </TableCell>
                    <TableCell>
                      {schedule.date} {schedule.time}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                          statusStyles[schedule.status]
                        )}
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
