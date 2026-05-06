"use client";

import { Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/tenant-dashboard/empty-state";
import { tenantDashboardIconMap } from "@/components/tenant-dashboard/icon-map";
import { cn } from "@/lib/utils";
import type {
  TenantProject,
  TenantQuickAction,
  TenantSocialStatus,
  TenantUpcomingPost,
} from "@/types/tenant-dashboard";

type TenantDashboardListsProps = {
  quickActions: TenantQuickAction[];
  recentProjects: TenantProject[];
  upcomingPosts: TenantUpcomingPost[];
  aiSuggestions: string[];
  socialStatus: TenantSocialStatus[];
};

const projectBadgeStyles: Record<TenantProject["status"], string> = {
  已完成: "bg-emerald-50 text-success ring-emerald-100",
  待審核: "bg-amber-50 text-warning ring-amber-100",
  草稿: "bg-slate-100 text-muted-foreground ring-slate-200",
};

export function TenantDashboardLists({
  quickActions,
  recentProjects,
  upcomingPosts,
  aiSuggestions,
  socialStatus,
}: TenantDashboardListsProps) {
  return (
    <>
      <section className="dashboard-card">
        <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
          快速操作
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action) => {
            const Icon = tenantDashboardIconMap[action.iconName] ?? Lightbulb;

            return (
              <button
                key={action.title}
                type="button"
                className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-4 text-center transition-colors hover:bg-slate-50"
              >
                <span className="icon-bubble">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
        <DashboardListCard title="最近專案">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <div key={project.title} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{project.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{project.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1", projectBadgeStyles[project.status])}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="尚無專案" description="建立第一個 AI 影片專案後，會顯示在這裡。" />
          )}
        </DashboardListCard>

        <DashboardListCard title="即將發布">
          {upcomingPosts.length > 0 ? (
            upcomingPosts.map((post) => (
              <div key={post.title} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-bold text-foreground">{post.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {post.platform} · {post.time}
                </p>
              </div>
            ))
          ) : (
            <EmptyState title="尚無排程" description="新增排程發文後，這裡會顯示即將發布的內容。" />
          )}
        </DashboardListCard>

        <DashboardListCard title="AI 建議">
          {aiSuggestions.length > 0 ? (
            aiSuggestions.map((suggestion) => (
              <div key={suggestion} className="flex gap-3 rounded-2xl border border-border bg-white p-4">
                <div className="icon-bubble shrink-0">
                  <Lightbulb aria-hidden="true" className="size-5" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{suggestion}</p>
              </div>
            ))
          ) : (
            <EmptyState title="尚無 AI 建議" description="累積影片、排程與成效資料後，AI 才會提供營運建議。" />
          )}
        </DashboardListCard>

        <DashboardListCard title="社群綁定狀態">
          <div className="flex flex-col gap-4">
            {socialStatus.map((item) => (
              <div key={item.platform} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{item.platform}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                      item.connected
                        ? "bg-emerald-50 text-success ring-emerald-100"
                        : "bg-amber-50 text-warning ring-amber-100"
                    )}
                  >
                    {item.connected ? `${item.count} 個帳號` : "未綁定"}
                  </Badge>
                </div>
                <Progress value={item.connected ? 100 : 0} className="[&_[data-slot=progress-track]]:h-2" />
              </div>
            ))}
          </div>
        </DashboardListCard>
      </section>
    </>
  );
}

function DashboardListCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-card xl:col-span-3">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
