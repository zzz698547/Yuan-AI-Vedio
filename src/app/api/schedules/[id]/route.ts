import { NextRequest, NextResponse } from "next/server";

import { getIntegrationState } from "@/lib/server-store";
import {
  deletePublishingScheduleRecord,
  updatePublishingScheduleRecord,
} from "@/lib/social-schedules";
import type { ScheduleAction } from "@/types/social-operations";

type ScheduleActionRequest = {
  action?: unknown;
};

const scheduleActions: ScheduleAction[] = ["publish", "draft", "fail"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = (await request.json()) as ScheduleActionRequest;

    if (!isScheduleAction(body.action)) {
      return NextResponse.json({ error: "排程操作不正確。" }, { status: 400 });
    }

    const { id } = await params;
    const schedule = updatePublishingScheduleRecord(
      getIntegrationState(),
      id,
      body.action
    );

    return NextResponse.json({
      data: schedule,
      message: getActionMessage(body.action),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新排程失敗。" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = deletePublishingScheduleRecord(getIntegrationState(), id);

    return NextResponse.json({
      data,
      message: "排程已刪除。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "刪除排程失敗。" },
      { status: 400 }
    );
  }
}

function isScheduleAction(value: unknown): value is ScheduleAction {
  return scheduleActions.some((action) => action === value);
}

function getActionMessage(action: ScheduleAction) {
  if (action === "publish") {
    return "排程已通過 token 驗證並更新為已發布。";
  }

  if (action === "fail") {
    return "排程已標記為發布失敗。";
  }

  return "排程已移回草稿。";
}
