import type { FacebookLoginFeature } from "@/types/facebook-sdk";

export const facebookLoginFeatures: FacebookLoginFeature[] = [
  {
    id: "basic-profile",
    label: "讀取基本資料",
    description: "取得 Facebook 帳號名稱、頭像與 email，方便顯示已授權身分。",
    scopes: ["public_profile", "email"],
  },
  {
    id: "page-list",
    label: "讀取粉專列表",
    description: "讓系統偵測可管理的粉絲專頁，作為後續綁定目標。",
    scopes: ["pages_show_list"],
  },
  {
    id: "publishing",
    label: "發布貼文與短影音",
    description: "允許後台排程發布貼文、Reels 或短影音內容。",
    scopes: ["pages_manage_posts", "instagram_content_publish"],
  },
  {
    id: "analytics",
    label: "讀取互動成效",
    description: "同步貼文互動、觸及與成效數據，提供營運分析使用。",
    scopes: ["pages_read_engagement", "instagram_basic"],
  },
];
