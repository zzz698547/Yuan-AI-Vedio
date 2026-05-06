import { NextResponse } from "next/server";

import { createAdminDashboardPayload } from "@/lib/admin-dashboard-data";
import { getAppStore, loadAppStore } from "@/lib/server-store";

export async function GET() {
  await loadAppStore();
  return NextResponse.json({
    data: createAdminDashboardPayload(getAppStore()),
  });
}
