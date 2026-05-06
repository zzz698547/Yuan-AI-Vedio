import { NextRequest, NextResponse } from "next/server";

import { isSocialPlatformId } from "@/lib/integration-service";
import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";
import {
  createPublishingScheduleRecord,
  getPublishingSchedulePayload,
} from "@/lib/social-schedules";

type ScheduleRequest = {
  tenantId?: string;
  title?: string;
  platform?: unknown;
  accountId?: string;
  caption?: string;
  mediaUrl?: string;
  publishAt?: string;
};

export async function GET() {
  await loadAppStore();
  return NextResponse.json({
    data: getPublishingSchedulePayload(getIntegrationState()),
  });
}

export async function POST(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json()) as ScheduleRequest;

    if (!isSocialPlatformId(body.platform)) {
      return NextResponse.json({ error: "社群平台不正確。" }, { status: 400 });
    }

    const integrations = getIntegrationState();
    const schedule = createPublishingScheduleRecord(integrations, {
      tenantId: body.tenantId ?? "",
      title: body.title ?? "",
      platform: body.platform,
      accountId: body.accountId,
      caption: body.caption,
      mediaUrl: body.mediaUrl,
      publishAt: body.publishAt ?? "",
    });

    await saveAppStore();
    return NextResponse.json({ data: schedule, message: "排程已建立。" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "建立排程失敗。" },
      { status: 400 }
    );
  }
}
