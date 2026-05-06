import { NextRequest, NextResponse } from "next/server";

import {
  createManualSocialBinding,
  isSocialPlatformId,
} from "@/lib/integration-service";
import { getIntegrationState } from "@/lib/server-store";

type ManualBindRequest = {
  platform?: unknown;
  accountName?: string;
  tenantName?: string;
  accessToken?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ManualBindRequest;

    if (!isSocialPlatformId(body.platform)) {
      return NextResponse.json({ error: "社群平台不正確。" }, { status: 400 });
    }

    const integrations = getIntegrationState();
    const account = createManualSocialBinding({
      platform: body.platform,
      accountName: body.accountName ?? "",
      tenantName: body.tenantName ?? "",
      accessToken: body.accessToken ?? "",
    });

    integrations.socialAccounts = [account, ...integrations.socialAccounts];
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
