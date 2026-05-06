import { NextRequest, NextResponse } from "next/server";

import { isSocialPlatformId } from "@/lib/integration-service";
import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";
import {
  createSocialOAuthStart,
  encodeOAuthCookie,
  SOCIAL_OAUTH_COOKIE,
} from "@/lib/social-oauth";

type OAuthStartRequest = {
  platformId?: unknown;
  tenantName?: string;
  returnTo?: string;
};

export async function POST(request: NextRequest) {
  await loadAppStore();
  const body = (await request.json()) as OAuthStartRequest;

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

  const result = createSocialOAuthStart(
    platform,
    body.tenantName ?? "",
    body.returnTo ?? "/tenant/social-accounts"
  );
  integrations.socialPlatforms = integrations.socialPlatforms.map((item) =>
    item.id === result.platform.id ? result.platform : item
  );
  await saveAppStore();

  const responseBody = {
    data: {
      platform: result.platform,
      platforms: integrations.socialPlatforms,
      accounts: integrations.socialAccounts,
      authorizationUrl: result.authorizationUrl,
    },
    message: result.platform.lastMessage,
  };

  const response = NextResponse.json(responseBody, {
    status: result.authorizationUrl ? 200 : 400,
  });

  if (result.cookiePayload) {
    response.cookies.set(SOCIAL_OAUTH_COOKIE, encodeOAuthCookie(result.cookiePayload), {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
