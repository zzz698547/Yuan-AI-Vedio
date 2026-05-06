import { NextRequest, NextResponse } from "next/server";

import {
  getNotificationPayload,
  updateNotificationEvents,
} from "@/lib/tenant-notification-service";
import { getTenantNotificationState } from "@/lib/server-store";
import type { NotificationEventId } from "@/types/notification";

type NotificationRequest = {
  tenantId?: string;
  enabledEvents?: NotificationEventId[];
};

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get("tenantId") || "tenant-demo";
  return NextResponse.json({
    data: getNotificationPayload(getTenantNotificationState(tenantId)),
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as NotificationRequest;
    const state = getTenantNotificationState(body.tenantId || "tenant-demo");
    const data = updateNotificationEvents(state, body.enabledEvents ?? []);

    return NextResponse.json({
      data,
      message: "通知事件設定已更新。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "通知設定更新失敗。" },
      { status: 400 }
    );
  }
}
