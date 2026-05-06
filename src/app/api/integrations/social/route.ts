import { NextResponse } from "next/server";

import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";
import { clearAllSocialBindings } from "@/lib/social-bindings";

export async function GET() {
  await loadAppStore();
  const integrations = getIntegrationState();

  return NextResponse.json({
    data: {
      platforms: integrations.socialPlatforms,
      accounts: integrations.socialAccounts,
    },
  });
}

export async function DELETE() {
  await loadAppStore();
  const integrations = getIntegrationState();
  const data = clearAllSocialBindings(integrations);

  await saveAppStore();
  return NextResponse.json({
    data,
    message: "已刪除所有社群綁定帳號。",
  });
}
