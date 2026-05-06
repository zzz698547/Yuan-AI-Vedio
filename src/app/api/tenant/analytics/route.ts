import { NextResponse } from "next/server";

import { getIntegrationState, loadAppStore } from "@/lib/server-store";
import { createSocialAnalyticsPayload } from "@/lib/social-analytics";

export async function GET() {
  await loadAppStore();
  return NextResponse.json({
    data: createSocialAnalyticsPayload(getIntegrationState()),
  });
}
