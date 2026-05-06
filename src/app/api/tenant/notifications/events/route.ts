import { NextRequest, NextResponse } from "next/server";

import {
  getTenantNotificationState,
  loadAppStore,
  saveAppStore,
} from "@/lib/server-store";
import { sendTenantNotificationEvent } from "@/lib/tenant-notification-service";
import type { NotificationEventId } from "@/types/notification";

type NotificationEventRequest = {
  tenantId?: string;
  eventId?: NotificationEventId;
  title?: string;
  detail?: string;
};

export async function POST(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json()) as NotificationEventRequest;

    if (!body.eventId || !body.title || !body.detail) {
      return NextResponse.json({ error: "通知事件資料不完整。" }, { status: 400 });
    }

    const result = await sendTenantNotificationEvent(
      getTenantNotificationState(body.tenantId || "tenant-demo"),
      {
        eventId: body.eventId,
        title: body.title,
        detail: body.detail,
      }
    );

    await saveAppStore();
    return NextResponse.json({
      data: result,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram 通知送出失敗。" },
      { status: 400 }
    );
  }
}
