import { NextResponse } from "next/server";

import { getDashboardSeedData, initializeAppStore } from "@/lib/server-store";

export async function POST() {
  const store = initializeAppStore();

  return NextResponse.json({
    data: {
      initializedAt: store.initializedAt,
      tenants: store.tenants,
      dashboards: getDashboardSeedData(),
    },
    message: "全站資料已初始化為空狀態。",
  });
}
