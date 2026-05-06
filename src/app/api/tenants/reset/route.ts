import { NextResponse } from "next/server";

import { initializePersistentAppStore } from "@/lib/server-store";

export async function POST() {
  const store = await initializePersistentAppStore();
  return NextResponse.json({
    data: store.tenants,
    message: "已清空並初始化全站資料。",
  });
}
