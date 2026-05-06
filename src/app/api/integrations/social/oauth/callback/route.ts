import { NextRequest, NextResponse } from "next/server";

import { getIntegrationState } from "@/lib/server-store";
import {
  decodeOAuthCookie,
  exchangeSocialOAuthCode,
  SOCIAL_OAUTH_COOKIE,
} from "@/lib/social-oauth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const providerError =
    url.searchParams.get("error_description") || url.searchParams.get("error");
  const cookiePayload = decodeOAuthCookie(
    request.cookies.get(SOCIAL_OAUTH_COOKIE)?.value
  );

  if (providerError) {
    return redirectToSocialAccounts(
      request,
      "error",
      providerError,
      cookiePayload?.returnTo
    );
  }

  if (!code || !state || !cookiePayload || cookiePayload.state !== state) {
    return redirectToSocialAccounts(
      request,
      "error",
      "OAuth state 驗證失敗，請重新綁定。"
    );
  }

  const integrations = getIntegrationState();
  const platform = integrations.socialPlatforms.find(
    (item) => item.id === cookiePayload.platform
  );

  if (!platform) {
    return redirectToSocialAccounts(request, "error", "找不到社群平台設定。");
  }

  try {
    const { account, tokenRecord } = await exchangeSocialOAuthCode(
      platform,
      code,
      cookiePayload.tenantName
    );

    integrations.socialAccounts = [account, ...integrations.socialAccounts];
    integrations.socialTokens = [
      tokenRecord,
      ...integrations.socialTokens.filter((token) => token.accountId !== account.id),
    ];
    integrations.socialPlatforms = integrations.socialPlatforms.map((item) =>
      item.id === platform.id
        ? {
            ...item,
            status: "已驗證",
            connectedCount: integrations.socialAccounts.filter(
              (connectedAccount) => connectedAccount.platform === platform.id
            ).length,
            lastSyncAt: account.syncedAt,
            lastMessage: "正式 OAuth 授權已完成。",
          }
        : item
    );

    const response = redirectToSocialAccounts(
      request,
      "success",
      `${platform.name} 授權完成。`,
      cookiePayload.returnTo
    );
    response.cookies.delete(SOCIAL_OAUTH_COOKIE);
    return response;
  } catch (error) {
    return redirectToSocialAccounts(
      request,
      "error",
      error instanceof Error ? error.message : "OAuth callback 處理失敗。",
      cookiePayload.returnTo
    );
  }
}

function redirectToSocialAccounts(
  request: NextRequest,
  status: "success" | "error",
  message: string,
  returnTo = "/tenant/social-accounts"
) {
  const redirectUrl = new URL(safeReturnTo(returnTo), request.url);
  redirectUrl.searchParams.set("oauth", status);
  redirectUrl.searchParams.set("message", message);
  const payload = {
    type: "social-oauth-complete",
    status,
    message,
    redirectUrl: redirectUrl.toString(),
  };
  const origin = new URL(request.url).origin;
  const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>社群授權完成</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f8fafc;
        color: #0f172a;
        font-family: Inter, "Noto Sans TC", sans-serif;
      }
      .card {
        width: min(420px, calc(100vw - 32px));
        border: 1px solid #e5eaf3;
        border-radius: 24px;
        background: #fff;
        padding: 28px;
        box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
        text-align: center;
      }
      p { color: #64748b; line-height: 1.7; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>社群授權處理完成</h1>
      <p>系統正在回到 Veltrix AI 後台並更新綁定狀態。</p>
    </div>
    <script>
      const payload = ${JSON.stringify(payload)};
      const targetOrigin = ${JSON.stringify(origin)};
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, targetOrigin);
        window.close();
      } else {
        window.location.replace(payload.redirectUrl);
      }
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function safeReturnTo(returnTo: string) {
  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }

  return "/tenant/social-accounts";
}
