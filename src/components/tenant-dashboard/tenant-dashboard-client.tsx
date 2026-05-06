"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { tenantDashboardIconMap } from "@/components/tenant-dashboard/icon-map";
import { TenantDashboardCharts } from "@/components/tenant-dashboard/tenant-dashboard-charts";
import { TenantDashboardLists } from "@/components/tenant-dashboard/tenant-dashboard-lists";
import { initialTenantDashboardData } from "@/data/tenant-dashboard";
import { getMockSession } from "@/lib/mock-auth";
import { getTenantDashboardApi } from "@/lib/tenant-dashboard-api";

export function TenantDashboardClient() {
  const [dashboardData, setDashboardData] = useState(initialTenantDashboardData);

  useEffect(() => {
    let isMounted = true;
    const session = getMockSession();

    getTenantDashboardApi(session?.tenantId)
      .then((data) => {
        if (isMounted) {
          setDashboardData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboardData(initialTenantDashboardData);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          歡迎回來，創意團隊！
        </h1>
        <p className="text-sm font-medium text-muted-foreground md:text-base">
          這是您的 AI 短影音營運概況。新工作區已初始化，目前尚無營運資料。
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {dashboardData.stats.map((stat) => {
          const Icon = tenantDashboardIconMap[stat.iconName] ?? Lightbulb;

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              color={stat.color}
              icon={<Icon />}
            />
          );
        })}
      </section>

      <TenantDashboardCharts
        videoTrend={dashboardData.videoTrend}
        platformPerformance={dashboardData.platformPerformance}
        tasks={dashboardData.tasks}
      />

      <TenantDashboardLists
        quickActions={dashboardData.quickActions}
        recentProjects={dashboardData.recentProjects}
        upcomingPosts={dashboardData.upcomingPosts}
        aiSuggestions={dashboardData.aiSuggestions}
        socialStatus={dashboardData.socialStatus}
      />
    </div>
  );
}
