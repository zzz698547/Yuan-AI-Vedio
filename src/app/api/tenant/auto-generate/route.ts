import { NextRequest, NextResponse } from "next/server";

import {
  getTenantAutomationState,
  setTenantAutomationState,
} from "@/lib/server-store";
import { validateAutomationSettings } from "@/lib/tenant-automation-service";
import type { TenantAutomationSettings } from "@/types/tenant-automation";

type SettingsRequest = Partial<TenantAutomationSettings> & {
  tenantId?: string;
};

function getTenantId(request: NextRequest) {
  return request.nextUrl.searchParams.get("tenantId")?.trim() || "default-tenant";
}

export async function GET(request: NextRequest) {
  const tenantId = getTenantId(request);
  return NextResponse.json({ data: getTenantAutomationState(tenantId) });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as SettingsRequest;
    const tenantId = body.tenantId?.trim() || getTenantId(request);
    const currentState = getTenantAutomationState(tenantId);
    const settings = validateAutomationSettings(body);
    const nextState = setTenantAutomationState(tenantId, {
      ...currentState,
      settings,
    });

    return NextResponse.json({
      data: nextState,
      message: "自動產出設定已保存。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "設定保存失敗。" },
      { status: 400 }
    );
  }
}
