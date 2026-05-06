import {
  createInitialIntegrationState,
  type IntegrationState,
} from "@/lib/integration-service";
import {
  cloneAutomationState,
  createAutomationState,
} from "@/lib/tenant-automation-service";
import {
  createTenantNotificationState,
  type TenantNotificationState,
} from "@/lib/tenant-notification-service";
import type { NotificationPayload } from "@/lib/tenant-notification-service";
import type { TenantAutomationState } from "@/types/tenant-automation";
import type { TenantRecord } from "@/types/tenant-management";

export type AppStore = {
  tenants: TenantRecord[];
  tenantAutomation: Record<string, TenantAutomationState>;
  tenantNotifications: Record<string, TenantNotificationState>;
  integrations: IntegrationState;
  initializedAt: string;
};

type StoreGlobal = typeof globalThis & {
  __aiVideoStore?: AppStore;
  __aiVideoStoreHydrated?: boolean;
  __aiVideoStoreLoadPromise?: Promise<AppStore>;
};

const storeKey = process.env.VELTRIX_STORE_KEY || "veltrix-ai:app-store";

export function createInitialStore(): AppStore {
  return {
    tenants: [],
    tenantAutomation: {},
    tenantNotifications: {},
    integrations: createInitialIntegrationState(),
    initializedAt: new Date().toISOString(),
  };
}

export function getAppStore() {
  const storeGlobal = globalThis as StoreGlobal;

  if (!storeGlobal.__aiVideoStore) {
    storeGlobal.__aiVideoStore = createInitialStore();
  }

  return storeGlobal.__aiVideoStore;
}

export async function loadAppStore() {
  const storeGlobal = globalThis as StoreGlobal;

  if (storeGlobal.__aiVideoStoreHydrated) {
    return getAppStore();
  }

  if (!storeGlobal.__aiVideoStoreLoadPromise) {
    storeGlobal.__aiVideoStoreLoadPromise = readPersistentStore().then((store) => {
      storeGlobal.__aiVideoStore = store ?? getAppStore();
      storeGlobal.__aiVideoStoreHydrated = true;
      return storeGlobal.__aiVideoStore;
    });
  }

  return storeGlobal.__aiVideoStoreLoadPromise;
}

export async function saveAppStore() {
  await loadAppStore();
  const store = getAppStore();
  await writePersistentStore(store);
  return store;
}

export async function initializePersistentAppStore() {
  const storeGlobal = globalThis as StoreGlobal;
  const store = createInitialStore();
  storeGlobal.__aiVideoStore = store;
  storeGlobal.__aiVideoStoreHydrated = true;
  storeGlobal.__aiVideoStoreLoadPromise = Promise.resolve(store);
  await writePersistentStore(store);
  return store;
}

export function getTenantAutomationState(tenantId: string) {
  const store = getAppStore();

  if (!store.tenantAutomation) {
    store.tenantAutomation = {};
  }

  if (!store.tenantAutomation[tenantId]) {
    store.tenantAutomation[tenantId] = createAutomationState(tenantId);
  }

  return cloneAutomationState(store.tenantAutomation[tenantId]);
}

export function setTenantAutomationState(
  tenantId: string,
  state: TenantAutomationState
) {
  const store = getAppStore();

  if (!store.tenantAutomation) {
    store.tenantAutomation = {};
  }

  store.tenantAutomation[tenantId] = cloneAutomationState({
    ...state,
    tenantId,
  });
  return cloneAutomationState(store.tenantAutomation[tenantId]);
}

export function getTenantNotificationState(tenantId: string) {
  const store = getAppStore();

  if (!store.tenantNotifications) {
    store.tenantNotifications = {};
  }

  if (!store.tenantNotifications[tenantId]) {
    store.tenantNotifications[tenantId] = createTenantNotificationState(tenantId);
  }

  return store.tenantNotifications[tenantId];
}

export function getTenantNotificationPayload(
  tenantId: string,
  toPayload: (state: TenantNotificationState) => NotificationPayload
) {
  return toPayload(getTenantNotificationState(tenantId));
}

export function getIntegrationState() {
  const store = getAppStore();

  if (!store.integrations) {
    store.integrations = createInitialIntegrationState();
  }

  if (!store.integrations.aiProviderSecrets) {
    store.integrations.aiProviderSecrets = [];
  }

  if (!store.integrations.socialTokens) {
    store.integrations.socialTokens = [];
  }

  cleanupLegacyShortcutBindings(store.integrations);

  return store.integrations;
}

function cleanupLegacyShortcutBindings(integrations: IntegrationState) {
  const nextAccounts = integrations.socialAccounts.filter(
    (account) => !account.accountName.includes("一鍵綁定帳號")
  );

  if (nextAccounts.length === integrations.socialAccounts.length) {
    return;
  }

  const accountIds = new Set(nextAccounts.map((account) => account.id));
  integrations.socialAccounts = nextAccounts;
  integrations.socialTokens = integrations.socialTokens.filter((token) =>
    accountIds.has(token.accountId)
  );
  integrations.socialPlatforms = integrations.socialPlatforms.map((platform) => {
    const connectedCount = nextAccounts.filter(
      (account) => account.platform === platform.id
    ).length;

    if (!platform.lastMessage?.includes("一鍵綁定")) {
      return { ...platform, connectedCount };
    }

    return {
      ...platform,
      status: connectedCount > 0 ? platform.status : "未設定",
      connectedCount,
      lastMessage: undefined,
      lastSyncAt: undefined,
    };
  });
}

async function readPersistentStore() {
  const config = getRedisConfig();

  if (!config) {
    return null;
  }

  try {
    const result = await runRedisCommand(["GET", storeKey], config);

    if (typeof result === "string") {
      return normalizeStore(JSON.parse(result) as unknown);
    }

    return normalizeStore(result);
  } catch (error) {
    console.error("Veltrix AI persistent store read failed", error);
    return null;
  }
}

async function writePersistentStore(store: AppStore) {
  const config = getRedisConfig();

  if (!config) {
    return;
  }

  try {
    await runRedisCommand(["SET", storeKey, JSON.stringify(store)], config);
  } catch (error) {
    console.error("Veltrix AI persistent store write failed", error);
  }
}

async function runRedisCommand(command: string[], config: RedisConfig) {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as {
    result?: unknown;
    error?: string;
  };

  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Redis REST 回應 ${response.status}`);
  }

  return payload.result;
}

type RedisConfig = {
  url: string;
  token: string;
};

function getRedisConfig(): RedisConfig | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

  if (!url || !token) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    token,
  };
}

function normalizeStore(value: unknown): AppStore | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    tenants: Array.isArray(value.tenants)
      ? (value.tenants as TenantRecord[])
      : [],
    tenantAutomation: isRecord(value.tenantAutomation)
      ? (value.tenantAutomation as Record<string, TenantAutomationState>)
      : {},
    tenantNotifications: isRecord(value.tenantNotifications)
      ? (value.tenantNotifications as Record<string, TenantNotificationState>)
      : {},
    integrations: normalizeIntegrations(value.integrations),
    initializedAt:
      typeof value.initializedAt === "string"
        ? value.initializedAt
        : new Date().toISOString(),
  };
}

function normalizeIntegrations(value: unknown) {
  if (!isRecord(value)) {
    return createInitialIntegrationState();
  }

  const fallback = createInitialIntegrationState();

  return {
    aiProviders: Array.isArray(value.aiProviders)
      ? (value.aiProviders as IntegrationState["aiProviders"])
      : fallback.aiProviders,
    aiProviderSecrets: Array.isArray(value.aiProviderSecrets)
      ? (value.aiProviderSecrets as IntegrationState["aiProviderSecrets"])
      : [],
    modelFeatures: Array.isArray(value.modelFeatures)
      ? (value.modelFeatures as IntegrationState["modelFeatures"])
      : fallback.modelFeatures,
    socialPlatforms: Array.isArray(value.socialPlatforms)
      ? (value.socialPlatforms as IntegrationState["socialPlatforms"])
      : fallback.socialPlatforms,
    socialAccounts: Array.isArray(value.socialAccounts)
      ? (value.socialAccounts as IntegrationState["socialAccounts"])
      : [],
    socialTokens: Array.isArray(value.socialTokens)
      ? (value.socialTokens as IntegrationState["socialTokens"])
      : [],
    schedules: Array.isArray(value.schedules)
      ? (value.schedules as IntegrationState["schedules"])
      : [],
    mediaTasks: Array.isArray(value.mediaTasks)
      ? (value.mediaTasks as IntegrationState["mediaTasks"])
      : [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
