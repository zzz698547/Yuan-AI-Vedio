import { NextRequest, NextResponse } from "next/server";

import { getAppStore } from "@/lib/server-store";
import type { TenantPlan, TenantRecord } from "@/types/tenant-management";

type CreateTenantRequest = {
  name?: string;
  contact?: string;
  username?: string;
  password?: string;
  nickname?: string;
  plan?: TenantPlan;
};

function isTenantPlan(value: unknown): value is TenantPlan {
  return value === "企業旗艦版" || value === "專業版" || value === "創作者版";
}

export async function GET() {
  const store = getAppStore();
  return NextResponse.json({ data: store.tenants });
}

export async function POST(request: NextRequest) {
  const store = getAppStore();
  const body = (await request.json()) as CreateTenantRequest;

  if (
    !body.name?.trim() ||
    !body.contact?.trim() ||
    !body.username?.trim() ||
    !body.password ||
    !body.nickname?.trim() ||
    !isTenantPlan(body.plan)
  ) {
    return NextResponse.json(
      { error: "租戶名稱、聯絡人、帳號、密碼、暱稱與方案皆為必填。" },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: "密碼至少需要 8 個字元。" }, { status: 400 });
  }

  const normalizedUsername = body.username.trim().toLowerCase();
  const isDuplicate = store.tenants.some(
    (tenant) => tenant.username.toLowerCase() === normalizedUsername
  );

  if (isDuplicate) {
    return NextResponse.json({ error: "此帳號已存在。" }, { status: 409 });
  }

  const tenant: TenantRecord = {
    id: `tenant-${Date.now()}`,
    name: body.name.trim(),
    contact: body.contact.trim(),
    username: body.username.trim(),
    password: body.password,
    nickname: body.nickname.trim(),
    plan: body.plan,
    status: "啟用中",
    expiredAt: "2026/12/31",
    videos: 0,
    apiUsage: 0,
    socialAccounts: 0,
  };

  store.tenants = [tenant, ...store.tenants];
  return NextResponse.json({ data: tenant, message: "租戶已建立。" }, { status: 201 });
}

export async function DELETE() {
  const store = getAppStore();
  store.tenants = [];
  return NextResponse.json({ data: store.tenants, message: "已刪除全部租戶。" });
}
