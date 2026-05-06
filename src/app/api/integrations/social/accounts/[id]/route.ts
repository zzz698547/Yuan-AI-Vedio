import { NextRequest, NextResponse } from "next/server";

import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";
import { deleteSocialAccountBinding } from "@/lib/social-bindings";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await loadAppStore();
    const { id } = await params;
    const data = deleteSocialAccountBinding(getIntegrationState(), id);

    await saveAppStore();
    return NextResponse.json({
      data,
      message: "社群帳號已刪除。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "刪除社群帳號失敗。" },
      { status: 400 }
    );
  }
}
