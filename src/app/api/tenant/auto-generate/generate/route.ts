import { NextRequest, NextResponse } from "next/server";

import {
  getTenantAutomationState,
  loadAppStore,
  saveAppStore,
  setTenantAutomationState,
} from "@/lib/server-store";
import { generateCandidates } from "@/lib/tenant-automation-service";

type GenerateRequest = {
  tenantId?: string;
};

export async function POST(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json().catch(() => ({}))) as GenerateRequest;
    const tenantId = body.tenantId?.trim() || "default-tenant";
    const currentState = getTenantAutomationState(tenantId);
    const generatedState = generateCandidates(currentState);
    const nextState = setTenantAutomationState(tenantId, generatedState);

    await saveAppStore();
    return NextResponse.json({
      data: nextState,
      message: "已產生候選影片。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "產生候選影片失敗。" },
      { status: 400 }
    );
  }
}
