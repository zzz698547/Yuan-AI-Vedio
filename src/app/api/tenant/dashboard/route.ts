import { NextRequest, NextResponse } from "next/server";

import { createTenantDashboardPayload } from "@/lib/tenant-dashboard-data";
import { getAppStore, loadAppStore } from "@/lib/server-store";

export async function GET(request: NextRequest) {
  await loadAppStore();
  const tenantId =
    request.nextUrl.searchParams.get("tenantId")?.trim() || "default-tenant";

  return NextResponse.json({
    data: createTenantDashboardPayload(getAppStore(), tenantId),
  });
}
