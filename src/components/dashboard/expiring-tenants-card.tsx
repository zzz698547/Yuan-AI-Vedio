import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { expiringTenants } from "@/data/mock-admin";
import { cn } from "@/lib/utils";
import type { ExpiringTenantItem } from "@/types/admin-dashboard";

function getStatusClass(status: string) {
  return status === "正常"
    ? "bg-emerald-50 text-success ring-emerald-100"
    : "bg-amber-50 text-warning ring-amber-100";
}

type ExpiringTenantsCardProps = {
  tenants?: readonly ExpiringTenantItem[];
};

export function ExpiringTenantsCard({
  tenants = expiringTenants,
}: ExpiringTenantsCardProps) {
  return (
    <section className="dashboard-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          即將到期的租戶
        </h2>
        <Link
          href="/admin/tenants"
          className="text-sm font-semibold text-primary hover:text-primary/80"
        >
          查看全部
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {tenants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-6 text-center">
            <p className="font-semibold text-foreground">目前沒有即將到期租戶</p>
            <p className="mt-2 text-sm text-muted-foreground">
              初始化後會保持空狀態，直到新增租戶資料。
            </p>
          </div>
        ) : null}
        {tenants.map((tenant) => {
          const displayStatus =
            tenant.status === "即將到期" ? "即將到期" : "正常";

          return (
          <div
            key={tenant.companyName}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
          >
            <Avatar className="size-10">
              <AvatarFallback className="bg-[#EAF3FF] font-semibold text-primary">
                {tenant.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {tenant.companyName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                到期日：{tenant.expiredAt}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                getStatusClass(displayStatus)
              )}
          >
            {displayStatus}
          </Badge>
          </div>
          );
        })}
      </div>
    </section>
  );
}
