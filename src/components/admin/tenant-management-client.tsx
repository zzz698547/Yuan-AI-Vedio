"use client";

import { BadgeCheck, Ban, Building2, CalendarClock } from "lucide-react";

import { TenantCreateModal } from "@/components/admin/tenant-create-modal";
import { TenantDetailModal } from "@/components/admin/tenant-detail-modal";
import { TenantEditModal } from "@/components/admin/tenant-edit-modal";
import { TenantListTable } from "@/components/admin/tenant-list-table";
import { TenantManagementToolbar } from "@/components/admin/tenant-management-toolbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { useTenantManagement } from "@/hooks/use-tenant-management";

export function TenantManagementClient() {
  const tenantManager = useTenantManagement();
  const activeCount = tenantManager.tenants.filter(
    (tenant) => tenant.status === "啟用中"
  ).length;
  const expiringCount = tenantManager.tenants.filter(
    (tenant) => tenant.status === "即將到期"
  ).length;
  const suspendedCount = tenantManager.tenants.filter(
    (tenant) => tenant.status === "已停權"
  ).length;
  const tenantStats = [
    {
      title: "全部租戶",
      value: tenantManager.tenants.length,
      change: "API",
      changeType: "increase" as const,
      color: "blue" as const,
      icon: <Building2 />,
    },
    {
      title: "啟用中",
      value: activeCount,
      change: "正常",
      changeType: "increase" as const,
      color: "green" as const,
      icon: <BadgeCheck />,
    },
    {
      title: "即將到期",
      value: expiringCount,
      change: "需追蹤",
      changeType: "increase" as const,
      color: "orange" as const,
      icon: <CalendarClock />,
    },
    {
      title: "已停權",
      value: suspendedCount,
      change: "可復權",
      changeType: suspendedCount > 0 ? ("decrease" as const) : ("increase" as const),
      color: "red" as const,
      icon: <Ban />,
    },
  ];

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          租戶管理
        </h1>
        <p className="text-sm font-medium text-muted-foreground md:text-base">
          管理所有客戶租戶、帳號狀態、到期日與使用量
        </p>
      </section>

      <TenantManagementToolbar
        query={tenantManager.query}
        statusFilter={tenantManager.statusFilter}
        planFilter={tenantManager.planFilter}
        onQueryChange={tenantManager.setQuery}
        onStatusChange={tenantManager.setStatusFilter}
        onPlanChange={tenantManager.setPlanFilter}
        onRestore={tenantManager.restoreTenants}
        onAddTenant={() => tenantManager.setIsCreateOpen(true)}
      />

      <div className="rounded-2xl border border-primary/15 bg-[#EAF3FF] px-4 py-3 text-sm font-semibold text-primary">
        {tenantManager.isLoading
          ? "正在載入租戶 API 資料..."
          : tenantManager.notice}
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tenantStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <TenantListTable
        tenants={tenantManager.filteredTenants}
        totalCount={tenantManager.tenants.length}
        onView={tenantManager.setSelectedTenant}
        onEdit={tenantManager.setEditingTenant}
        onToggleSuspension={tenantManager.toggleSuspension}
        onExtend={tenantManager.extendTenant}
        onDelete={tenantManager.deleteTenant}
        onDeleteAll={tenantManager.deleteAllTenants}
      />

      <TenantDetailModal
        tenant={tenantManager.selectedTenant}
        onClose={() => tenantManager.setSelectedTenant(null)}
      />
      <TenantEditModal
        tenant={tenantManager.editingTenant}
        onClose={() => tenantManager.setEditingTenant(null)}
        onSave={tenantManager.saveTenantEdit}
      />
      <TenantCreateModal
        open={tenantManager.isCreateOpen}
        existingUsernames={tenantManager.tenants.map((tenant) =>
          tenant.username.toLowerCase()
        )}
        onClose={() => tenantManager.setIsCreateOpen(false)}
        onCreate={tenantManager.createTenant}
      />
    </div>
  );
}
