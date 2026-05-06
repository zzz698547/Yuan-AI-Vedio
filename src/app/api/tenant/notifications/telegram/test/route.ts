import { NextRequest, NextResponse } from "next/server";

import { getTenantNotificationState } from "@/lib/server-store";
import { sendTelegramTest } from "@/lib/tenant-notification-service";

type TelegramTestRequest = {
  tenantId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramTestRequest;
    const data = await sendTelegramTest(
      getTenantNotificationState(body.tenantId || "tenant-demo")
    );

    return NextResponse.json({
      data,
      message: "Telegram 測試通知已送出。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram 測試失敗。" },
      { status: 400 }
    );
  }
}
