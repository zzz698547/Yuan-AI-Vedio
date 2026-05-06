import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarDays,
  Film,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { createAdminDashboardPayload } from "@/lib/admin-dashboard-data";
import { getAppStore, loadAppStore } from "@/lib/server-store";
import { AdminInitializeButton } from "@/components/dashboard/admin-initialize-button";
import { ActivityLogTable } from "@/components/dashboard/activity-log-table";
import { AnnouncementCard } from "@/components/dashboard/announcement-card";
import { ExpiringTenantsCard } from "@/components/dashboard/expiring-tenants-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentVideos } from "@/components/dashboard/recent-videos";
import { ScheduleCalendarCard } from "@/components/dashboard/schedule-calendar-card";
import { SocialBindStatus } from "@/components/dashboard/social-bind-status";
import { StatCard } from "@/components/dashboard/stat-card";
import { TenantStatusChart } from "@/components/dashboard/tenant-status-chart";
import { UsageLineChart } from "@/components/dashboard/usage-line-chart";

export const dynamic = "force-dynamic";

const statIconMap: Record<string, LucideIcon> = {
  "building-2": Building2,
  "badge-check": BadgeCheck,
  film: Film,
  sparkles: Sparkles,
  activity: Activity,
};

export default async function AdminDashboardPage() {
  await loadAppStore();
  const dashboardData = createAdminDashboardPayload(getAppStore());

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="dashboard-hero p-5 md:p-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-[#EAF3FF] px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              管理員總覽
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-[-0.04em] text-foreground md:text-4xl">
                歡迎回來，Admin！
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-7 text-muted-foreground md:text-base">
                這是您系統的總覽概況，快速掌握租戶狀態、影片生成量與平台使用趨勢。
              </p>
            </div>
            <AdminInitializeButton />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
            <div className="rounded-2xl border border-border bg-white/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <span className="icon-bubble size-10 rounded-xl bg-[#EAF3FF]">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    資料區間
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    2026 年 5 月
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <span className="icon-bubble size-10 rounded-xl bg-emerald-50 text-success">
                  <BadgeCheck className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    系統狀態
                  </p>
                  <p className="text-sm font-bold text-success">運作正常</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {dashboardData.statsCards.map((card) => {
          const Icon = statIconMap[card.icon] ?? Activity;

          return (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              color={card.color}
              icon={<Icon />}
            />
          );
        })}
      </section>

      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 [&>section]:h-full">
        <div className="lg:col-span-7 2xl:col-span-5">
          <UsageLineChart data={dashboardData.usageChartData} />
        </div>
        <div className="lg:col-span-5 2xl:col-span-4">
          <TenantStatusChart data={dashboardData.tenantStatus} />
        </div>
        <div className="lg:col-span-12 2xl:col-span-3">
          <ExpiringTenantsCard tenants={dashboardData.expiringTenants} />
        </div>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12 [&>section]:h-full">
        <div className="lg:col-span-6 2xl:col-span-3">
          <QuickActions />
        </div>
        <div className="lg:col-span-6 2xl:col-span-3">
          <RecentVideos videos={dashboardData.recentVideos} />
        </div>
        <div className="lg:col-span-6 2xl:col-span-3">
          <SocialBindStatus accounts={dashboardData.socialAccounts} />
        </div>
        <div className="lg:col-span-6 2xl:col-span-3">
          <ScheduleCalendarCard days={dashboardData.scheduleDays} />
        </div>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 [&>section]:h-full">
        <div className="lg:col-span-8">
          <ActivityLogTable logs={dashboardData.activityLogs} />
        </div>
        <div className="lg:col-span-4">
          <AnnouncementCard />
        </div>
      </section>
    </div>
  );
}
