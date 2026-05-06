import type { MockLoginAccount } from "@/types/auth";

export const mockLoginAccounts: MockLoginAccount[] = [
  {
    role: "admin",
    title: "超級管理員登入",
    description: "管理所有租戶、AI 模型、社群綁定與系統設定。",
    accountLabel: "管理員帳號",
    username: "zzz698547",
    password: "Bill20050214",
    userName: "Admin",
    roleLabel: "超級管理員",
    badgeLabel: "管理員後台",
    redirectTo: "/admin/dashboard",
    accent: "blue",
  },
  {
    role: "tenant",
    title: "租戶登入",
    description: "進入品牌工作區，管理影片、排程發文與成效分析。",
    accountLabel: "租戶帳號",
    username: "tenant-demo",
    password: "Tenant2026",
    userName: "創意團隊",
    roleLabel: "租戶管理者",
    badgeLabel: "租戶工作區",
    redirectTo: "/tenant/dashboard",
    accent: "green",
  },
];
