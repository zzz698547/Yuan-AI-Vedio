"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  SocialAnalyticsTrendPoint,
  SocialPlatformAnalytics,
} from "@/types/social-operations";

type AnalyticsChartsProps = {
  trend: SocialAnalyticsTrendPoint[];
  platforms: SocialPlatformAnalytics[];
};

export function AnalyticsCharts({ trend, platforms }: AnalyticsChartsProps) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <article className="dashboard-card xl:col-span-7">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground">近 7 日發布趨勢</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            依內部排程狀態統計，未灌水推估外部互動數。
          </p>
        </div>
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ left: -20, right: 12 }}>
              <CartesianGrid stroke="#E5EAF3" strokeDasharray="4 4" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E5EAF3" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="scheduled"
                name="已排程"
                stroke="#2F80ED"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="published"
                name="已發布"
                stroke="#22C55E"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="failed"
                name="失敗"
                stroke="#EF4444"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="dashboard-card xl:col-span-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground">平台發布分佈</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            以目前綁定平台與排程狀態計算。
          </p>
        </div>
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platforms} margin={{ left: -20, right: 12 }}>
              <CartesianGrid stroke="#E5EAF3" strokeDasharray="4 4" />
              <XAxis dataKey="platformName" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E5EAF3" }} />
              <Legend />
              <Bar dataKey="publishedCount" name="已發布" fill="#22C55E" radius={8} />
              <Bar dataKey="scheduledCount" name="已排程" fill="#2F80ED" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
