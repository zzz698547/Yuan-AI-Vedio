import { NextResponse } from "next/server";

import { initializePersistentAppStore } from "@/lib/server-store";

export async function POST() {
  const store = await initializePersistentAppStore();

  return NextResponse.json({
    data: {
      initializedAt: store.initializedAt,
      tenants: store.tenants,
      tenantAutomation: store.tenantAutomation,
      tenantNotifications: store.tenantNotifications,
      integrations: {
        socialAccounts: store.integrations.socialAccounts,
        schedules: store.integrations.schedules,
        mediaTasks: store.integrations.mediaTasks,
      },
    },
    message: "全站資料已清空並初始化為空狀態。",
  });
}
