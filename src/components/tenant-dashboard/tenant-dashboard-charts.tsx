"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/tenant-dashboard/empty-state";
import { cn } from "@/lib/utils";
import type {
  TenantDashboardTask,
  TenantPlatformPerformance,
  TenantVideoTrendPoint,
} from "@/types/tenant-dashboard";

type TenantDashboardChartsProps = {
  videoTrend: TenantVideoTrendPoint[];
  platformPerformance: TenantPlatformPerformance[];
  tasks: TenantDashboardTask[];
};

const taskBadgeStyles: Record<TenantDashboardTask["status"], string> = {
  待處理: "bg-blue-50 text-primary ring-blue-100",
  重要: "bg-red-50 text-danger ring-red-100",
  已排程: "bg-violet-50 text-[#8B5CF6] ring-violet-100",
};

export function TenantDashboardCharts({
  videoTrend,
  platformPerformance,
  tasks,
}: TenantDashboardChartsProps) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="dashboard-card overflow-hidden xl:col-span-5">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
          本月影片生成趨勢
        </h2>
        {videoTrend.length > 0 ? (
          <div className="h-[260px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={videoTrend}
                margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
              >
                <CartesianGrid stroke="#E5EAF3" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip contentStyle={{ border: "1px solid #E5EAF3", borderRadius: 16 }} />
                <Line type="monotone" dataKey="videos" name="生成影片" stroke="#2F80ED" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="尚未產生影片"
            description="第一次登入時工作區會保持乾淨。上傳素材或啟動 AI 生成後，趨勢圖才會開始累積資料。"
          />
        )}
      </div>

      <div className="dashboard-card overflow-hidden xl:col-span-3">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
          社群平台成效
        </h2>
        {platformPerformance.length > 0 ? (
          <div className="h-[260px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformPerformance} margin={{ left: -16 }}>
                <CartesianGrid stroke="#E5EAF3" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip contentStyle={{ border: "1px solid #E5EAF3", borderRadius: 16 }} />
                <Bar dataKey="engagement" name="互動率" fill="#22C55E" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="尚無平台成效"
            description="綁定社群帳號並發布內容後，這裡會顯示各平台互動率。"
          />
        )}
      </div>

      <div className="dashboard-card xl:col-span-4">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
          今日待處理任務
        </h2>
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <article key={task.title} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{task.detail}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1", taskBadgeStyles[task.status])}
                  >
                    {task.status}
                  </Badge>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="目前沒有待處理任務"
            description="新的租戶工作區不會預設任何任務，等建立專案或排程後才會出現提醒。"
          />
        )}
      </div>
    </section>
  );
}
