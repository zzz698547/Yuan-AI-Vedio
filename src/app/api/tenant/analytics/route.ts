import { NextResponse } from "next/server";

import { getIntegrationState } from "@/lib/server-store";
import { createSocialAnalyticsPayload } from "@/lib/social-analytics";

export async function GET() {
  return NextResponse.json({
    data: createSocialAnalyticsPayload(getIntegrationState()),
  });
}
