export type RoutePlaceholder = {
  title: string;
  subtitle: string;
  statusLabel: string;
  tasks: string[];
  primaryAction: string;
};

export const adminRoutePlaceholders = {
  plans: {
    title: "方案與定價",
    subtitle: "管理訂閱方案、功能額度、價格與租戶升級流程。",
    statusLabel: "規劃中",
    tasks: ["建立方案卡片", "設定影片生成額度", "串接付款與發票流程"],
    primaryAction: "新增方案",
  },
  videoAnalysis: {
    title: "影片分析與腳本",
    subtitle: "集中管理參考影片解析、腳本拆解與原創腳本產生流程。",
    statusLabel: "待串接 AI",
    tasks: ["建立分析任務佇列", "保存腳本結構", "加入內容風險提示"],
    primaryAction: "建立分析任務",
  },
  videoGeneration: {
    title: "AI 影片生成",
    subtitle: "管理跨租戶的 AI 影片生成任務、狀態與成本追蹤。",
    statusLabel: "待串接 Provider",
    tasks: ["設定生成模型", "建立任務狀態流", "加入成本與錯誤監控"],
    primaryAction: "新增生成任務",
  },
  videoEditor: {
    title: "影片剪輯工具",
    subtitle: "提供管理員檢視剪輯模板、字幕樣式與品牌素材規範。",
    statusLabel: "介面準備中",
    tasks: ["建立模板清單", "管理字幕樣式", "設定輸出比例"],
    primaryAction: "新增剪輯模板",
  },
  trendingGenerator: {
    title: "熱門影片產生器",
    subtitle: "追蹤熱門題材、平台趨勢與可轉換的短影音腳本方向。",
    statusLabel: "趨勢資料待接入",
    tasks: ["整理趨勢來源", "建立品牌適配分數", "加入風險篩選"],
    primaryAction: "新增趨勢來源",
  },
  team: {
    title: "團隊管理",
    subtitle: "管理後台成員、邀請狀態與跨部門協作權限。",
    statusLabel: "權限設計中",
    tasks: ["建立成員列表", "新增邀請流程", "設定角色範圍"],
    primaryAction: "邀請成員",
  },
  roles: {
    title: "角色與權限",
    subtitle: "定義管理員角色、功能權限與敏感操作保護規則。",
    statusLabel: "待建立權限矩陣",
    tasks: ["建立角色清單", "設定功能權限", "加入操作稽核"],
    primaryAction: "新增角色",
  },
} satisfies Record<string, RoutePlaceholder>;

export const tenantRoutePlaceholders = {
  socialAccounts: {
    title: "社群綁定",
    subtitle: "管理品牌的 Facebook、Instagram、TikTok 與 YouTube 連線狀態。",
    statusLabel: "OAuth 待串接",
    tasks: ["建立平台連線卡片", "同步權限狀態", "提醒 Token 到期"],
    primaryAction: "新增社群帳號",
  },
  brand: {
    title: "品牌設定",
    subtitle: "集中管理品牌語氣、視覺元素、禁用詞與內容準則。",
    statusLabel: "品牌資料待補",
    tasks: ["建立品牌語氣", "上傳品牌素材", "設定內容安全規則"],
    primaryAction: "新增品牌規則",
  },
} satisfies Record<string, RoutePlaceholder>;
