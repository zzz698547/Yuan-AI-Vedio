import { NextRequest, NextResponse } from "next/server";

import { getAppStore, loadAppStore, saveAppStore } from "@/lib/server-store";
import type { TenantRecord, TenantStatus } from "@/types/tenant-management";

type UpdateTenantRequest = Partial<
  Pick<TenantRecord, "name" | "contact" | "expiredAt" | "status">
>;

function isTenantStatus(value: unknown): value is TenantStatus {
  return value === "啟用中" || value === "即將到期" || value === "已停權";
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  await loadAppStore();
  const { id } = await context.params;
  const store = getAppStore();
  const body = (await request.json()) as UpdateTenantRequest;
  const tenant = store.tenants.find((item) => item.id === id);

  if (!tenant) {
    return NextResponse.json({ error: "找不到租戶。" }, { status: 404 });
  }

  const nextTenant: TenantRecord = {
    ...tenant,
    name: body.name?.trim() || tenant.name,
    contact: body.contact?.trim() || tenant.contact,
    expiredAt: body.expiredAt ?? tenant.expiredAt,
    status: isTenantStatus(body.status) ? body.status : tenant.status,
  };

  store.tenants = store.tenants.map((item) =>
    item.id === id ? nextTenant : item
  );

  await saveAppStore();
  return NextResponse.json({ data: nextTenant, message: "租戶已更新。" });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  await loadAppStore();
  const { id } = await context.params;
  const store = getAppStore();
  const tenant = store.tenants.find((item) => item.id === id);

  if (!tenant) {
    return NextResponse.json({ error: "找不到租戶。" }, { status: 404 });
  }

  store.tenants = store.tenants.filter((item) => item.id !== id);
  await saveAppStore();
  return NextResponse.json({ data: tenant, message: "租戶已刪除。" });
}
