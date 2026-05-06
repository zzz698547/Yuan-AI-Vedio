import { NextResponse } from "next/server";

import { getDashboardSeedData } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json({ data: getDashboardSeedData().admin });
}
