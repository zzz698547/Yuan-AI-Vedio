"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { usageChartData } from "@/data/mock-admin";

type ChartTooltipPayload = {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipPayload[];
};

function UsageTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex min-w-36 items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-foreground">
              {Number(item.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsageLineChart() {
  return (
    <section className="dashboard-card overflow-hidden">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            使用狀況概覽
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            影片生成量與 API 使用量趨勢
          </p>
        </div>
        <Button variant="outline" className="h-9 rounded-xl bg-white">
          近 30 天
        </Button>
      </div>

      <div className="h-[260px] min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 640, height: 260 }}
        >
          <LineChart
            data={usageChartData}
            margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
          >
            <CartesianGrid stroke="#E5EAF3" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              minTickGap={18}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              width={52}
            />
            <Tooltip content={<UsageTooltip />} cursor={{ stroke: "#E5EAF3" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: 16,
                fontSize: 13,
              }}
            />
            <Line
              name="影片生成量"
              type="monotone"
              dataKey="video"
              stroke="#2F80ED"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              name="API 使用量"
              type="monotone"
              dataKey="api"
              stroke="#22C55E"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
