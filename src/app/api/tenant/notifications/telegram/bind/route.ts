import { NextRequest, NextResponse } from "next/server";

import {
  getTenantNotificationState,
  loadAppStore,
  saveAppStore,
} from "@/lib/server-store";
import { bindTelegram } from "@/lib/tenant-notification-service";

type TelegramBindRequest = {
  tenantId?: string;
  botToken?: string;
  chatId?: string;
};

export async function POST(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json()) as TelegramBindRequest;
    const data = bindTelegram(getTenantNotificationState(body.tenantId || "tenant-demo"), {
      botToken: body.botToken ?? "",
      chatId: body.chatId ?? "",
    });

    await saveAppStore();
    return NextResponse.json({
      data,
      message: "Telegram 已手動綁定。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram 綁定失敗。" },
      { status: 400 }
    );
  }
}
