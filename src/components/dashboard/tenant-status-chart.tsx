"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { tenantStatus } from "@/data/mock-admin";
import type { TenantStatusDatum } from "@/types/admin-dashboard";

const statusColors: Record<TenantStatusDatum["color"], string> = {
  green: "#22C55E",
  orange: "#F59E0B",
  purple: "#8B5CF6",
  red: "#EF4444",
};

type ChartTooltipPayload = {
  name?: string | number;
  value?: string | number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
};

function StatusTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-foreground">{item.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {Number(item.value).toLocaleString()} 位租戶
      </p>
    </div>
  );
}

type TenantStatusChartProps = {
  data?: readonly TenantStatusDatum[];
};

export function TenantStatusChart({ data = tenantStatus }: TenantStatusChartProps) {
  const totalTenants = data.reduce((total, item) => total + item.value, 0);

  return (
    <section className="dashboard-card overflow-hidden">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        租戶狀態分佈
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_180px] md:items-center">
        <div className="relative h-[260px] min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 320, height: 260 }}
          >
            <PieChart>
              <Tooltip content={<StatusTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="84%"
                paddingAngle={4}
                stroke="#FFFFFF"
                strokeWidth={4}
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={statusColors[item.color]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {totalTenants}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                總租戶
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: statusColors[item.color] }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
                {item.name}
              </span>
              <span className="text-sm font-bold text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
