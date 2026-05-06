import { NextRequest, NextResponse } from "next/server";

import { createMediaTask } from "@/lib/integration-service";
import { getIntegrationState, getTenantNotificationState } from "@/lib/server-store";
import { sendTenantNotificationEvent } from "@/lib/tenant-notification-service";
import type { MediaTaskType } from "@/types/integrations";

type MediaTaskRequest = {
  tenantId?: string;
  type?: MediaTaskType;
  title?: string;
  input?: string;
};

const mediaTaskTypes: MediaTaskType[] = [
  "reference-analysis",
  "video-generation",
  "video-editing",
];

function isMediaTaskType(value: unknown): value is MediaTaskType {
  return mediaTaskTypes.includes(value as MediaTaskType);
}

export async function GET() {
  return NextResponse.json({ data: getIntegrationState().mediaTasks });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MediaTaskRequest;

    if (!isMediaTaskType(body.type)) {
      return NextResponse.json({ error: "媒體任務類型不正確。" }, { status: 400 });
    }

    const task = createMediaTask({
      tenantId: body.tenantId ?? "default-tenant",
      type: body.type,
      title: body.title ?? "",
      input: body.input ?? "",
    });

    const integrations = getIntegrationState();
    integrations.mediaTasks = [task, ...integrations.mediaTasks];
    const notification =
      body.type === "video-generation" ? await tryNotifyVideoGenerated(task) : null;

    return NextResponse.json(
      { data: task, notification, message: "媒體任務已執行。" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "媒體任務執行失敗。" },
      { status: 400 }
    );
  }
}

async function tryNotifyVideoGenerated(task: {
  tenantId: string;
  title: string;
}) {
  try {
    return await sendTenantNotificationEvent(getTenantNotificationState(task.tenantId), {
      eventId: "ai-video-generated",
      title: "AI 生成影片完成",
      detail: `影片「${task.title}」已完成 AI 生成。`,
    });
  } catch (error) {
    return {
      sent: false,
      message: error instanceof Error ? error.message : "Telegram 通知送出失敗。",
    };
  }
}
