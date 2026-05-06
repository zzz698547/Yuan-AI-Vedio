import { NextRequest, NextResponse } from "next/server";

import {
  getTenantAutomationState,
  setTenantAutomationState,
} from "@/lib/server-store";
import { applyCandidateAction } from "@/lib/tenant-automation-service";
import type { TenantCandidateAction } from "@/types/tenant-automation";

type CandidateActionRequest = {
  action?: TenantCandidateAction;
  tenantId?: string;
};

const candidateActions: TenantCandidateAction[] = [
  "approve",
  "reject",
  "schedule",
  "revise",
];

function isCandidateAction(value: unknown): value is TenantCandidateAction {
  return candidateActions.includes(value as TenantCandidateAction);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as CandidateActionRequest;

    if (!isCandidateAction(body.action)) {
      return NextResponse.json({ error: "候選影片操作不正確。" }, { status: 400 });
    }

    const tenantId = body.tenantId?.trim() || "default-tenant";
    const currentState = getTenantAutomationState(tenantId);
    const updatedState = applyCandidateAction(currentState, id, body.action);
    const nextState = setTenantAutomationState(tenantId, updatedState);

    return NextResponse.json({
      data: nextState,
      message: "候選影片狀態已更新。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "候選影片操作失敗。" },
      { status: 400 }
    );
  }
}
