import { NextRequest, NextResponse } from "next/server";

import { createSchedule, isSocialPlatformId } from "@/lib/integration-service";
import { getIntegrationState } from "@/lib/server-store";

type ScheduleRequest = {
  tenantId?: string;
  title?: string;
  platform?: unknown;
  publishAt?: string;
};

export async function GET() {
  return NextResponse.json({ data: getIntegrationState().schedules });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ScheduleRequest;

    if (!isSocialPlatformId(body.platform)) {
      return NextResponse.json({ error: "社群平台不正確。" }, { status: 400 });
    }

    const integrations = getIntegrationState();
    const platform = integrations.socialPlatforms.find((item) => item.id === body.platform);

    if (!platform || platform.status !== "已驗證") {
      return NextResponse.json(
        { error: "請先完成社群手動綁定後再建立真實排程。" },
        { status: 400 }
      );
    }

    const schedule = createSchedule({
      tenantId: body.tenantId ?? "",
      title: body.title ?? "",
      platform: body.platform,
      publishAt: body.publishAt ?? "",
    });
    integrations.schedules = [schedule, ...integrations.schedules];

    return NextResponse.json({ data: schedule, message: "排程已建立。" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "建立排程失敗。" },
      { status: 400 }
    );
  }
}
