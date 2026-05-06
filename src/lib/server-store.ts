import * as adminData from "@/data/mock-admin";
import * as tenantData from "@/data/mock-tenant";
import { mockTenants } from "@/data/mock-tenants";
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

type AppStore = {
  tenants: TenantRecord[];
  tenantAutomation: Record<string, TenantAutomationState>;
  tenantNotifications: Record<string, TenantNotificationState>;
  integrations: IntegrationState;
  initializedAt: string;
};

type StoreGlobal = typeof globalThis & {
  __aiVideoStore?: AppStore;
};

function cloneTenants(tenants: TenantRecord[]) {
  return tenants.map((tenant) => ({ ...tenant }));
}

function createInitialStore(): AppStore {
  return {
    tenants: cloneTenants(mockTenants),
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

export function initializeAppStore() {
  const storeGlobal = globalThis as StoreGlobal;
  storeGlobal.__aiVideoStore = createInitialStore();
  return storeGlobal.__aiVideoStore;
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

export function getDashboardSeedData() {
  return {
    admin: {
      statsCards: adminData.statsCards,
      usageChartData: adminData.usageChartData,
      tenantStatus: adminData.tenantStatus,
      expiringTenants: adminData.expiringTenants,
      recentVideos: adminData.recentVideos,
      socialAccounts: adminData.socialAccounts,
      scheduleDays: adminData.scheduleDays,
      activityLogs: adminData.activityLogs,
      announcements: adminData.announcements,
    },
    tenant: tenantData.mockTenant,
  };
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
