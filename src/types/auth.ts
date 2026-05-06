export type AuthRole = "admin" | "tenant";

export type MockLoginAccount = {
  role: AuthRole;
  title: string;
  description: string;
  accountLabel: string;
  username: string;
  password: string;
  userName: string;
  roleLabel: string;
  badgeLabel: string;
  redirectTo: string;
  accent: "blue" | "green";
};

export type AuthenticatedAccount = Pick<
  MockLoginAccount,
  "role" | "username" | "userName" | "roleLabel" | "redirectTo"
> & {
  tenantId?: string;
  tenantName?: string;
};

export type MockAuthSession = {
  role: AuthRole;
  username: string;
  userName: string;
  roleLabel: string;
  tenantId?: string;
  tenantName?: string;
  loginAt: string;
};
