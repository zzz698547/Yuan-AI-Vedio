import { mockLoginAccounts } from "@/data/mock-auth";
import type {
  AuthenticatedAccount,
  AuthRole,
  MockAuthSession,
  MockLoginAccount,
} from "@/types/auth";

const MOCK_AUTH_STORAGE_KEY = "ai-video-platform-session";

export function getMockLoginAccount(role: AuthRole): MockLoginAccount {
  const account = mockLoginAccounts.find((item) => item.role === role);

  if (!account) {
    throw new Error(`Missing mock login account for role: ${role}`);
  }

  return account;
}

export function verifyMockLogin(
  role: AuthRole,
  username: string,
  password: string
): MockLoginAccount | null {
  const account = getMockLoginAccount(role);
  const isValid =
    username.trim() === account.username && password === account.password;

  return isValid ? account : null;
}

export function saveMockSession(account: AuthenticatedAccount) {
  if (typeof window === "undefined") {
    return;
  }

  const session: MockAuthSession = {
    role: account.role,
    username: account.username,
    userName: account.userName,
    roleLabel: account.roleLabel,
    tenantId: account.tenantId,
    tenantName: account.tenantName,
    loginAt: new Date().toISOString(),
  };

  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getMockSession(): MockAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as MockAuthSession;
  } catch {
    window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearMockSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}
