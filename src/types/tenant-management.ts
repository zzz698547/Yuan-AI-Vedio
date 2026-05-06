export type TenantPlan = "企業旗艦版" | "專業版" | "創作者版";

export type TenantStatus = "啟用中" | "即將到期" | "已停權";

export type TenantRecord = {
  id: string;
  name: string;
  contact: string;
  username: string;
  password: string;
  nickname: string;
  plan: TenantPlan;
  status: TenantStatus;
  expiredAt: string;
  videos: number;
  apiUsage: number;
  socialAccounts: number;
};
