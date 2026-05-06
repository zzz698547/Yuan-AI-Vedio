import { NextResponse } from "next/server";

import { initializeAppStore } from "@/lib/server-store";

export async function POST() {
  const store = initializeAppStore();
  return NextResponse.json({
    data: store.tenants,
    message: "已初始化空租戶資料。",
  });
}
