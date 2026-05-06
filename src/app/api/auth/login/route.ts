import { NextRequest, NextResponse } from "next/server";

import { mockLoginAccounts } from "@/data/mock-auth";
import { getAppStore } from "@/lib/server-store";
import type { AuthRole, AuthenticatedAccount, MockLoginAccount } from "@/types/auth";

type LoginRequest = {
  role?: AuthRole;
  username?: string;
  password?: string;
};

function isAuthRole(value: unknown): value is AuthRole {
  return value === "admin" || value === "tenant";
}

function toAuthenticatedAccount(account: MockLoginAccount): AuthenticatedAccount {
  return {
    role: account.role,
    username: account.username,
    userName: account.userName,
    roleLabel: account.roleLabel,
    redirectTo: account.redirectTo,
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginRequest;

  if (!isAuthRole(body.role) || !body.username?.trim() || !body.password) {
    return NextResponse.json(
      { error: "請輸入登入身分、帳號與密碼。" },
      { status: 400 }
    );
  }

  const normalizedUsername = body.username.trim().toLowerCase();

  if (body.role === "admin") {
    const adminAccount = mockLoginAccounts.find((account) => account.role === "admin");
    const isValidAdmin =
      adminAccount?.username.toLowerCase() === normalizedUsername &&
      adminAccount.password === body.password;

    if (!adminAccount || !isValidAdmin) {
      return NextResponse.json({ error: "帳號或密碼不正確。" }, { status: 401 });
    }

    return NextResponse.json({ data: toAuthenticatedAccount(adminAccount) });
  }

  const store = getAppStore();
  const tenant = store.tenants.find(
    (item) =>
      item.username.toLowerCase() === normalizedUsername &&
      item.password === body.password
  );

  if (!tenant) {
    return NextResponse.json({ error: "帳號或密碼不正確。" }, { status: 401 });
  }

  if (tenant.status === "已停權") {
    return NextResponse.json(
      { error: "此租戶已停權，請聯絡系統管理員。" },
      { status: 403 }
    );
  }

  const tenantTemplate = mockLoginAccounts.find((account) => account.role === "tenant");
  const account: AuthenticatedAccount = {
    role: "tenant",
    username: tenant.username,
    userName: tenant.nickname,
    roleLabel: tenantTemplate?.roleLabel ?? "租戶管理者",
    redirectTo: tenantTemplate?.redirectTo ?? "/tenant/dashboard",
    tenantId: tenant.id,
    tenantName: tenant.name,
  };

  return NextResponse.json({ data: account });
}
