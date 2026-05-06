import { maskSecret } from "@/lib/integration-service";
import type {
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
  SocialTokenRecord,
} from "@/types/integrations";

export const SOCIAL_OAUTH_COOKIE = "social_oauth_state";

export type SocialOAuthCookie = {
  state: string;
  platform: SocialPlatformId;
  tenantName: string;
  returnTo: string;
};

type OAuthTokenResult = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scopes: string[];
  tokenType?: string;
  providerAccountName: string;
};

export function createSocialOAuthStart(
  platform: SocialPlatformBinding,
  tenantName: string,
  returnTo: string
) {
  const clientId = process.env[platform.clientIdEnv];
  const clientSecret = process.env[platform.clientSecretEnv];
  const checkedAt = new Date().toISOString();

  if (!clientId || !clientSecret) {
    return {
      platform: {
        ...platform,
        status: "缺少環境變數" as const,
        lastSyncAt: checkedAt,
        lastMessage: `請設定 ${platform.clientIdEnv} 與 ${platform.clientSecretEnv}。`,
      },
      authorizationUrl: null,
      cookiePayload: null,
    };
  }

  const state = `${platform.id}.${crypto.randomUUID()}`;
  const cookiePayload: SocialOAuthCookie = {
    state,
    platform: platform.id,
    tenantName: tenantName.trim() || "目前租戶",
    returnTo: normalizeReturnTo(returnTo),
  };

  return {
    platform: {
      ...platform,
      status: "OAuth 待完成" as const,
      lastSyncAt: checkedAt,
      lastMessage: "正式 OAuth 授權連結已建立，等待平台 callback。",
    },
    authorizationUrl: buildAuthorizationUrl(platform, clientId, state),
    cookiePayload,
  };
}

export async function exchangeSocialOAuthCode(
  platform: SocialPlatformBinding,
  code: string,
  tenantName: string
) {
  const tokenResult = await fetchProviderToken(platform, code);
  const now = new Date().toISOString();
  const accountId = `social-${platform.id}-${Date.now()}`;

  const account: SocialAccountBinding = {
    id: accountId,
    platform: platform.id,
    accountName: tokenResult.providerAccountName,
    tenantName: tenantName.trim() || "目前租戶",
    tokenMasked: maskSecret(tokenResult.accessToken),
    bindingMethod: "OAuth",
    expiresAt: tokenResult.expiresAt,
    grantedScopes: tokenResult.scopes,
    tokenStatus: "正常",
    permissionStatus: getOAuthPermissionStatus(platform.id, tokenResult.scopes),
    syncedAt: now,
  };

  const tokenRecord: SocialTokenRecord = {
    accountId,
    platform: platform.id,
    accessToken: tokenResult.accessToken,
    refreshToken: tokenResult.refreshToken,
    expiresAt: tokenResult.expiresAt,
    scopes: tokenResult.scopes,
    tokenType: tokenResult.tokenType,
    createdAt: now,
  };

  return { account, tokenRecord };
}

export function encodeOAuthCookie(payload: SocialOAuthCookie) {
  return encodeURIComponent(JSON.stringify(payload));
}

export function decodeOAuthCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<SocialOAuthCookie>;

    if (
      typeof parsed.state === "string" &&
      isSocialPlatform(parsed.platform) &&
      typeof parsed.tenantName === "string" &&
      typeof parsed.returnTo === "string"
    ) {
      return parsed as SocialOAuthCookie;
    }
  } catch {
    return null;
  }

  return null;
}

export function getSocialRedirectUri() {
  if (process.env.SOCIAL_OAUTH_REDIRECT_URI) {
    return process.env.SOCIAL_OAUTH_REDIRECT_URI;
  }

  if (process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI) {
    return process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/social/oauth/callback`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/integrations/social/oauth/callback`;
  }

  return "http://localhost:3000/api/integrations/social/oauth/callback";
}

function buildAuthorizationUrl(
  platform: SocialPlatformBinding,
  clientId: string,
  state: string
) {
  const redirectUri = getSocialRedirectUri();

  if (platform.id === "tiktok") {
    return buildUrl("https://www.tiktok.com/v2/auth/authorize/", {
      client_key: clientId,
      response_type: "code",
      scope: platform.scopes.join(","),
      redirect_uri: redirectUri,
      state,
    });
  }

  if (platform.id === "youtube") {
    return buildUrl("https://accounts.google.com/o/oauth2/v2/auth", {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: platform.scopes.join(" "),
      state,
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
    });
  }

  return buildUrl("https://www.facebook.com/v22.0/dialog/oauth", {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: getMetaLoginScopes(platform).join(","),
    state,
  });
}

async function fetchProviderToken(
  platform: SocialPlatformBinding,
  code: string
): Promise<OAuthTokenResult> {
  if (platform.id === "tiktok") {
    return fetchTikTokToken(platform, code);
  }

  if (platform.id === "youtube") {
    return fetchYouTubeToken(platform, code);
  }

  return fetchMetaToken(platform, code);
}

async function fetchMetaToken(platform: SocialPlatformBinding, code: string) {
  const tokenUrl = buildUrl("https://graph.facebook.com/v22.0/oauth/access_token", {
    client_id: getRequiredEnv(platform.clientIdEnv),
    client_secret: getRequiredEnv(platform.clientSecretEnv),
    redirect_uri: getSocialRedirectUri(),
    code,
  });
  const token = await fetchJson(tokenUrl);
  const accessToken = readRequiredString(token, "access_token");
  const expiresIn = readNumber(token, "expires_in");
  const providerAccountName = await fetchMetaAccountName(platform.id, accessToken);
  const scopes = getMetaLoginScopes(platform);

  return {
    accessToken,
    expiresAt: toExpiresAt(expiresIn),
    scopes,
    tokenType: readOptionalString(token, "token_type"),
    providerAccountName,
  };
}

async function fetchTikTokToken(platform: SocialPlatformBinding, code: string) {
  const token = await postForm("https://open.tiktokapis.com/v2/oauth/token/", {
    client_key: getRequiredEnv(platform.clientIdEnv),
    client_secret: getRequiredEnv(platform.clientSecretEnv),
    code,
    grant_type: "authorization_code",
    redirect_uri: getSocialRedirectUri(),
  });
  const accessToken = readRequiredString(token, "access_token");
  const refreshToken = readOptionalString(token, "refresh_token");
  const expiresIn = readNumber(token, "expires_in");
  const scopes = splitScopes(readOptionalString(token, "scope"), platform.scopes);
  const openId = readOptionalString(token, "open_id");
  const providerAccountName = await fetchTikTokAccountName(accessToken, openId);

  return {
    accessToken,
    refreshToken,
    expiresAt: toExpiresAt(expiresIn),
    scopes,
    tokenType: readOptionalString(token, "token_type"),
    providerAccountName,
  };
}

async function fetchYouTubeToken(platform: SocialPlatformBinding, code: string) {
  const token = await postForm("https://oauth2.googleapis.com/token", {
    client_id: getRequiredEnv(platform.clientIdEnv),
    client_secret: getRequiredEnv(platform.clientSecretEnv),
    code,
    grant_type: "authorization_code",
    redirect_uri: getSocialRedirectUri(),
  });
  const accessToken = readRequiredString(token, "access_token");
  const refreshToken = readOptionalString(token, "refresh_token");
  const expiresIn = readNumber(token, "expires_in");
  const scopes = splitScopes(readOptionalString(token, "scope"), platform.scopes);
  const providerAccountName = await fetchYouTubeChannelName(accessToken);

  return {
    accessToken,
    refreshToken,
    expiresAt: toExpiresAt(expiresIn),
    scopes,
    tokenType: readOptionalString(token, "token_type"),
    providerAccountName,
  };
}

async function fetchMetaAccountName(
  platform: SocialPlatformId,
  accessToken: string
) {
  const profile = await safeFetchJson(
    buildUrl("https://graph.facebook.com/v22.0/me", {
      fields: "id,name",
      access_token: accessToken,
    })
  );
  return readOptionalString(profile, "name") || `${getPlatformLabel(platform)} 已授權帳號`;
}

async function fetchTikTokAccountName(accessToken: string, openId: string) {
  const profile = await safeFetchJson(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = readRecord(profile, "data");
  const user = readRecord(data, "user");
  return readOptionalString(user, "display_name") || openId || "TikTok 已授權帳號";
}

async function fetchYouTubeChannelName(accessToken: string) {
  const profile = await safeFetchJson(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const items = profile.items;

  if (Array.isArray(items)) {
    const firstItem = items[0];
    if (isRecord(firstItem)) {
      return readOptionalString(readRecord(firstItem, "snippet"), "title") || "YouTube 已授權頻道";
    }
  }

  return "YouTube 已授權頻道";
}

async function postForm(url: string, params: Record<string, string>) {
  return fetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
}

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => ({})) as unknown;

  if (!response.ok) {
    const record = isRecord(payload) ? payload : {};
    const message =
      readOptionalString(record, "error_description") ||
      readOptionalString(record, "error") ||
      `OAuth 供應商回應 ${response.status}`;
    throw new Error(message);
  }

  if (!isRecord(payload)) {
    throw new Error("OAuth 供應商回應格式不正確。");
  }

  return payload;
}

async function safeFetchJson(url: string, init?: RequestInit) {
  try {
    return await fetchJson(url, init);
  } catch {
    return {};
  }
}

function buildUrl(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function getRequiredEnv(envKey: string) {
  const value = process.env[envKey];

  if (!value) {
    throw new Error(`缺少環境變數 ${envKey}。`);
  }

  return value;
}

function readRequiredString(record: Record<string, unknown>, key: string) {
  const value = readOptionalString(record, key);

  if (!value) {
    throw new Error(`OAuth 回應缺少 ${key}。`);
  }

  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

function readRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return isRecord(value) ? value : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function splitScopes(scope: string, fallback: string[]) {
  if (!scope) {
    return fallback;
  }

  return scope.includes(",")
    ? scope.split(",").filter(Boolean)
    : scope.split(" ").filter(Boolean);
}

function getMetaLoginScopes(platform: SocialPlatformBinding) {
  if (process.env.META_ADVANCED_SCOPES_ENABLED === "true") {
    return platform.scopes;
  }

  return ["public_profile", "email"];
}

function getOAuthPermissionStatus(platform: SocialPlatformId, scopes: string[]) {
  if (platform === "youtube") {
    return scopes.some((scope) => scope.includes("youtube.upload"))
      ? ("可上傳" as const)
      : ("待授權" as const);
  }

  const canPublish = scopes.some((scope) =>
    ["pages_manage_posts", "instagram_content_publish", "video.publish"].includes(
      scope
    )
  );
  return canPublish ? ("可發文" as const) : ("待授權" as const);
}

function toExpiresAt(expiresIn: number | undefined) {
  if (!expiresIn) {
    return undefined;
  }

  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

function getPlatformLabel(platform: SocialPlatformId) {
  const labels: Record<SocialPlatformId, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
  };
  return labels[platform];
}

function normalizeReturnTo(returnTo: string) {
  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }

  return "/tenant/social-accounts";
}

function isSocialPlatform(value: unknown): value is SocialPlatformId {
  return (
    value === "facebook" ||
    value === "instagram" ||
    value === "tiktok" ||
    value === "youtube"
  );
}
