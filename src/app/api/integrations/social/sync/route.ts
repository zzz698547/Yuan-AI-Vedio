import { NextRequest, NextResponse } from "next/server";

import { isSocialPlatformId } from "@/lib/integration-service";
import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";

type SyncRequest = {
  platformId?: unknown;
};

export async function POST(request: NextRequest) {
  await loadAppStore();
  const body = (await request.json()) as SyncRequest;

  if (!isSocialPlatformId(body.platformId)) {
    return NextResponse.json({ error: "社群平台不正確。" }, { status: 400 });
  }

  const integrations = getIntegrationState();
  const platform = integrations.socialPlatforms.find(
    (item) => item.id === body.platformId
  );

  if (!platform) {
    return NextResponse.json({ error: "找不到社群平台。" }, { status: 404 });
  }

  if (platform.status !== "已驗證") {
    const nextPlatform = {
      ...platform,
      lastSyncAt: new Date().toISOString(),
      lastMessage: "尚未完成 OAuth 綁定，無法同步真實帳號。",
    };
    integrations.socialPlatforms = integrations.socialPlatforms.map((item) =>
      item.id === nextPlatform.id ? nextPlatform : item
    );
    await saveAppStore();

    return NextResponse.json(
      {
        data: {
          platforms: integrations.socialPlatforms,
          accounts: integrations.socialAccounts,
        },
        error: nextPlatform.lastMessage,
      },
      { status: 400 }
    );
  }

  const syncedPlatform = {
    ...platform,
    lastSyncAt: new Date().toISOString(),
    lastMessage: "社群帳號已同步。",
  };
  integrations.socialPlatforms = integrations.socialPlatforms.map((item) =>
    item.id === syncedPlatform.id ? syncedPlatform : item
  );
  await saveAppStore();

  return NextResponse.json({
    data: {
      platforms: integrations.socialPlatforms,
      accounts: integrations.socialAccounts,
    },
    message: syncedPlatform.lastMessage,
  });
}
