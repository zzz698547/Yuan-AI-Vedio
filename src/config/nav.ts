export type NavItem = {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const adminNavItems: NavGroup[] = [
  {
    title: "總覽",
    items: [
      {
        title: "總覽儀表板",
        href: "/admin/dashboard",
        iconName: "LayoutDashboard",
      },
    ],
  },
  {
    title: "管理員功能",
    items: [
      {
        title: "租戶管理",
        href: "/admin/tenants",
        iconName: "Building2",
      },
      {
        title: "方案與定價",
        href: "/admin/plans",
        iconName: "BadgeDollarSign",
      },
      {
        title: "使用狀況",
        href: "/admin/usage",
        iconName: "Activity",
      },
      {
        title: "系統設定",
        href: "/admin/settings",
        iconName: "Settings",
      },
    ],
  },
  {
    title: "AI 影片功能",
    items: [
      {
        title: "影片分析與腳本",
        href: "/admin/video-analysis",
        iconName: "FileVideo",
      },
      {
        title: "AI 影片生成",
        href: "/admin/video-generation",
        iconName: "WandSparkles",
      },
      {
        title: "影片剪輯工具",
        href: "/admin/video-editor",
        iconName: "Scissors",
      },
      {
        title: "熱門影片產生器",
        href: "/admin/trending-generator",
        iconName: "Flame",
        badge: "Hot",
      },
      {
        title: "排程發文",
        href: "/admin/schedules",
        iconName: "CalendarClock",
      },
    ],
  },
  {
    title: "整合設定",
    items: [
      {
        title: "AI 模型綁定",
        href: "/admin/ai-models",
        iconName: "BrainCircuit",
      },
      {
        title: "社群帳號綁定",
        href: "/admin/social-accounts",
        iconName: "Share2",
      },
    ],
  },
  {
    title: "系統管理",
    items: [
      {
        title: "團隊管理",
        href: "/admin/team",
        iconName: "UsersRound",
      },
      {
        title: "角色與權限",
        href: "/admin/roles",
        iconName: "ShieldCheck",
      },
      {
        title: "操作日誌",
        href: "/admin/logs",
        iconName: "ScrollText",
      },
    ],
  },
];

export const tenantNavItems: NavGroup[] = [
  {
    title: "工作區",
    items: [
      {
        title: "租戶儀表板",
        href: "/tenant/dashboard",
        iconName: "LayoutDashboard",
      },
      {
        title: "我的影片",
        href: "/tenant/videos",
        iconName: "Video",
      },
      {
        title: "參考影片分析",
        href: "/tenant/reference-analysis",
        iconName: "SearchCheck",
      },
      {
        title: "AI 剪輯器",
        href: "/tenant/editor",
        iconName: "Clapperboard",
      },
      {
        title: "每日自動產出",
        href: "/tenant/auto-generate",
        iconName: "RefreshCw",
        badge: "每日",
      },
      {
        title: "通知設定",
        href: "/tenant/notifications",
        iconName: "Bell",
      },
    ],
  },
  {
    title: "社群營運",
    items: [
      {
        title: "社群綁定",
        href: "/tenant/social-accounts",
        iconName: "Link",
      },
      {
        title: "排程發文",
        href: "/tenant/social-publishing",
        iconName: "CalendarClock",
      },
      {
        title: "成效分析",
        href: "/tenant/analytics",
        iconName: "ChartNoAxesCombined",
      },
    ],
  },
  {
    title: "設定",
    items: [
      {
        title: "品牌設定",
        href: "/tenant/brand",
        iconName: "Palette",
      },
      {
        title: "API 模型設定",
        href: "/tenant/settings",
        iconName: "SlidersHorizontal",
      },
    ],
  },
];

export const navConfig = {
  adminNavItems,
  tenantNavItems,
};
