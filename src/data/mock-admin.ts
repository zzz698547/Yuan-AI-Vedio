export const statsCards = [
  {
    title: "總租戶數",
    value: "128",
    change: "+12.4%",
    changeType: "increase",
    icon: "building-2",
    color: "blue",
  },
  {
    title: "活躍租戶",
    value: "98",
    change: "+8.1%",
    changeType: "increase",
    icon: "badge-check",
    color: "green",
  },
  {
    title: "影片總數",
    value: "3,456",
    change: "+18.7%",
    changeType: "increase",
    icon: "film",
    color: "purple",
  },
  {
    title: "本月產出影片",
    value: "1,234",
    change: "+24.9%",
    changeType: "increase",
    icon: "sparkles",
    color: "orange",
  },
  {
    title: "本月使用量",
    value: "78.5%",
    change: "-3.2%",
    changeType: "decrease",
    icon: "activity",
    color: "red",
  },
] as const;

export const usageChartData = [
  { date: "05/01", video: 86, api: 1240 },
  { date: "05/02", video: 92, api: 1380 },
  { date: "05/03", video: 78, api: 1195 },
  { date: "05/04", video: 104, api: 1510 },
  { date: "05/05", video: 118, api: 1680 },
  { date: "05/06", video: 126, api: 1765 },
  { date: "05/07", video: 112, api: 1620 },
  { date: "05/08", video: 135, api: 1890 },
  { date: "05/09", video: 148, api: 2075 },
  { date: "05/10", video: 121, api: 1710 },
  { date: "05/11", video: 96, api: 1425 },
  { date: "05/12", video: 108, api: 1580 },
  { date: "05/13", video: 132, api: 1835 },
  { date: "05/14", video: 144, api: 1980 },
  { date: "05/15", video: 157, api: 2145 },
  { date: "05/16", video: 163, api: 2260 },
  { date: "05/17", video: 139, api: 1955 },
  { date: "05/18", video: 124, api: 1780 },
  { date: "05/19", video: 151, api: 2090 },
  { date: "05/20", video: 166, api: 2325 },
  { date: "05/21", video: 172, api: 2410 },
  { date: "05/22", video: 160, api: 2215 },
  { date: "05/23", video: 149, api: 2060 },
  { date: "05/24", video: 137, api: 1935 },
  { date: "05/25", video: 155, api: 2160 },
  { date: "05/26", video: 181, api: 2525 },
  { date: "05/27", video: 176, api: 2460 },
  { date: "05/28", video: 168, api: 2355 },
  { date: "05/29", video: 190, api: 2680 },
  { date: "05/30", video: 204, api: 2860 },
] as const;

export const tenantStatus = [
  { name: "啟用中", value: 98, color: "green" },
  { name: "已暫停", value: 15, color: "orange" },
  { name: "即將到期", value: 10, color: "purple" },
  { name: "已過期", value: 5, color: "red" },
] as const;

export const expiringTenants = [
  {
    companyName: "晨星行銷科技",
    avatar: "晨",
    expiredAt: "2026-05-08",
    status: "即將到期",
  },
  {
    companyName: "藍海電商股份有限公司",
    avatar: "藍",
    expiredAt: "2026-05-10",
    status: "即將到期",
  },
  {
    companyName: "拾光影像工作室",
    avatar: "拾",
    expiredAt: "2026-05-12",
    status: "續約待確認",
  },
  {
    companyName: "好食品牌顧問",
    avatar: "好",
    expiredAt: "2026-05-15",
    status: "即將到期",
  },
  {
    companyName: "橙點教育平台",
    avatar: "橙",
    expiredAt: "2026-05-18",
    status: "付款處理中",
  },
] as const;

export const recentVideos = [
  {
    title: "夏季新品 15 秒廣告",
    createdAt: "2026-05-06 14:30",
    thumbnail: "/mock/videos/summer-product.jpg",
    duration: "00:15",
    status: "已完成",
  },
  {
    title: "房仲物件開箱短影音",
    createdAt: "2026-05-06 13:12",
    thumbnail: "/mock/videos/real-estate-tour.jpg",
    duration: "00:32",
    status: "生成中",
  },
  {
    title: "線上課程招生影片",
    createdAt: "2026-05-06 11:48",
    thumbnail: "/mock/videos/course-launch.jpg",
    duration: "00:45",
    status: "待審核",
  },
  {
    title: "餐飲品牌新品介紹",
    createdAt: "2026-05-05 18:20",
    thumbnail: "/mock/videos/food-brand.jpg",
    duration: "00:28",
    status: "已發布",
  },
  {
    title: "企業 SaaS 功能亮點",
    createdAt: "2026-05-05 16:05",
    thumbnail: "/mock/videos/saas-feature.jpg",
    duration: "01:05",
    status: "草稿",
  },
] as const;

export const socialAccounts = [
  {
    platform: "Facebook",
    connectedCount: 42,
    status: "連線正常",
  },
  {
    platform: "Instagram",
    connectedCount: 38,
    status: "連線正常",
  },
  {
    platform: "TikTok",
    connectedCount: 24,
    status: "部分需重新授權",
  },
  {
    platform: "YouTube",
    connectedCount: 31,
    status: "連線正常",
  },
] as const;

export const scheduleDays = [
  { date: "2026-05-01", type: "published" },
  { date: "2026-05-02", type: "scheduled" },
  { date: "2026-05-03", type: "draft" },
  { date: "2026-05-05", type: "published" },
  { date: "2026-05-06", type: "scheduled" },
  { date: "2026-05-08", type: "scheduled" },
  { date: "2026-05-09", type: "published" },
  { date: "2026-05-11", type: "draft" },
  { date: "2026-05-13", type: "scheduled" },
  { date: "2026-05-15", type: "published" },
  { date: "2026-05-17", type: "scheduled" },
  { date: "2026-05-19", type: "draft" },
  { date: "2026-05-21", type: "scheduled" },
  { date: "2026-05-23", type: "published" },
  { date: "2026-05-25", type: "scheduled" },
  { date: "2026-05-27", type: "draft" },
  { date: "2026-05-29", type: "scheduled" },
  { date: "2026-05-30", type: "published" },
] as const;

export const activityLogs = [
  {
    time: "2026-05-06 14:42",
    actor: "系統管理員",
    action: "啟用租戶",
    target: "晨星行銷科技",
    status: "成功",
  },
  {
    time: "2026-05-06 13:58",
    actor: "林語晴",
    action: "調整 API 額度",
    target: "藍海電商股份有限公司",
    status: "成功",
  },
  {
    time: "2026-05-06 12:31",
    actor: "系統排程",
    action: "發布影片",
    target: "餐飲品牌新品介紹",
    status: "成功",
  },
  {
    time: "2026-05-06 11:09",
    actor: "陳柏安",
    action: "重新授權社群帳號",
    target: "TikTok 帳號同步",
    status: "待處理",
  },
  {
    time: "2026-05-05 18:44",
    actor: "王品萱",
    action: "建立新影片",
    target: "企業 SaaS 功能亮點",
    status: "草稿",
  },
  {
    time: "2026-05-05 17:26",
    actor: "系統偵測",
    action: "用量告警",
    target: "橙點教育平台",
    status: "注意",
  },
] as const;

export const announcements = [
  {
    title: "AI 影片模型升級通知",
    content: "新一代腳本轉影片模型已上線，預期可提升短影音生成穩定度與畫面一致性。",
    date: "2026-05-06",
    type: "系統更新",
  },
  {
    title: "五月份用量結算提醒",
    content: "請管理員於月底前確認租戶方案、加購額度與未結清款項。",
    date: "2026-05-05",
    type: "營運提醒",
  },
  {
    title: "社群平台授權政策調整",
    content: "部分 TikTok 與 Instagram 帳號可能需要重新授權，請通知受影響租戶完成更新。",
    date: "2026-05-03",
    type: "重要公告",
  },
] as const;

export const mockAdmin = {
  statsCards,
  usageChartData,
  tenantStatus,
  expiringTenants,
  recentVideos,
  socialAccounts,
  scheduleDays,
  activityLogs,
  announcements,
};
