import { NextRequest, NextResponse } from "next/server";

import {
  createManualSocialBinding,
  isSocialPlatformId,
} from "@/lib/integration-service";
import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";

type ManualBindRequest = {
  platform?: unknown;
  accountName?: string;
  tenantName?: string;
  accessToken?: string;
};

export async function POST(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json()) as ManualBindRequest;

    if (!isSocialPlatformId(body.platform)) {
      return NextResponse.json({ error: "社群平台不正確。" }, { status: 400 });
    }

    const integrations = getIntegrationState();
    const platformConfig = integrations.socialPlatforms.find(
      (platform) => platform.id === body.platform
    );

    if (!platformConfig) {
      return NextResponse.json({ error: "找不到社群平台設定。" }, { status: 404 });
    }

    const { account, tokenRecord } = createManualSocialBinding({
      platform: body.platform,
      accountName: body.accountName ?? "",
      tenantName: body.tenantName ?? "",
      accessToken: body.accessToken ?? "",
      scopes: platformConfig.scopes,
    });

    integrations.socialAccounts = [account, ...integrations.socialAccounts];
    integrations.socialTokens = [
      tokenRecord,
      ...integrations.socialTokens.filter((token) => token.accountId !== account.id),
    ];
    integrations.socialPlatforms = integrations.socialPlatforms.map((platform) =>
      platform.id === body.platform
        ? {
            ...platform,
            status: "已驗證",
            connectedCount: integrations.socialAccounts.filter(
              (item) => item.platform === body.platform
            ).length,
            lastSyncAt: account.syncedAt,
            lastMessage: "已透過手動 Access Token 綁定。",
          }
        : platform
    );

    await saveAppStore();
    return NextResponse.json(
      {
        data: {
          platforms: integrations.socialPlatforms,
          accounts: integrations.socialAccounts,
        },
        message: "社群帳號已手動綁定。",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "手動綁定失敗。" },
      { status: 400 }
    );
  }
}
