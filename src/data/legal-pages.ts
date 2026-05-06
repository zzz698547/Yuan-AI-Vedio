export type LegalPageSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalPageContent = {
  slug: "privacy" | "terms" | "data-deletion";
  title: string;
  eyebrow: string;
  description: string;
  effectiveDate: string;
  contactEmail: string;
  metaPurpose: string;
  sections: LegalPageSection[];
};

const contactEmail = "support@veltrix.ai";
const effectiveDate = "2026/05/06";

export const legalPages: Record<LegalPageContent["slug"], LegalPageContent> = {
  privacy: {
    slug: "privacy",
    title: "隱私權政策",
    eyebrow: "Privacy Policy",
    description:
      "說明 Veltrix AI 如何蒐集、使用、保存與保護使用者資料，以及 Facebook / Instagram 授權資料的處理方式。",
    effectiveDate,
    contactEmail,
    metaPurpose: "Meta App 後台 Privacy Policy URL",
    sections: [
      {
        title: "一、我們蒐集的資料",
        paragraphs: [
          "Veltrix AI 是 AI 短影音營運與社群排程管理平台。當使用者註冊、登入、建立租戶、綁定社群帳號或使用 AI 影片功能時，我們可能會蒐集必要的帳號、租戶、操作紀錄與系統使用資料。",
          "若使用者透過 Facebook Login 或 Meta OAuth 授權，我們只會依使用者同意的權限取得必要資料，例如公開個人資料、email、可管理粉專清單、粉專互動資料或發布所需權限。",
        ],
      },
      {
        title: "二、資料使用目的",
        items: [
          "驗證使用者身分並提供登入服務。",
          "建立租戶工作區、管理帳號權限與使用額度。",
          "協助使用者綁定 Facebook Page、Instagram Business Account 與其他社群平台。",
          "執行短影音排程發布、成效分析、通知與營運儀表板功能。",
          "維護平台安全、偵測異常操作與改善產品體驗。",
        ],
      },
      {
        title: "三、Facebook 與 Instagram 資料",
        paragraphs: [
          "透過 Meta 授權取得的資料僅用於使用者在 Veltrix AI 內啟用的社群營運功能。我們不會販售使用者的 Facebook 或 Instagram 資料，也不會將資料用於未經授權的廣告投放、個人追蹤或第三方轉售。",
          "使用者可以隨時在平台後台解除綁定，或透過 Facebook / Instagram 的應用程式設定撤銷授權。",
        ],
      },
      {
        title: "四、資料保存與安全",
        items: [
          "Access Token 與敏感憑證會以後端環境或安全儲存方式處理，不會在前端公開顯示完整內容。",
          "我們會採取合理的技術與管理措施，降低未授權存取、資料外洩或濫用風險。",
          "當資料不再為提供服務所必要，或使用者要求刪除時，我們會依資料刪除流程處理。",
        ],
      },
      {
        title: "五、聯絡我們",
        paragraphs: [
          `若您對隱私權政策、資料使用或 Meta 授權資料有任何疑問，請聯絡 ${contactEmail}。`,
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "服務條款",
    eyebrow: "Terms of Service",
    description:
      "使用 Veltrix AI 前，請先了解平台服務範圍、使用者責任、AI 內容規範與第三方平台授權條款。",
    effectiveDate,
    contactEmail,
    metaPurpose: "Meta App 後台 Terms of Service URL",
    sections: [
      {
        title: "一、服務內容",
        paragraphs: [
          "Veltrix AI 提供 AI 影片生成、參考影片分析、社群帳號綁定、排程發布、成效分析與租戶管理等 SaaS 後台功能。部分功能可能仍處於測試或逐步開放階段。",
        ],
      },
      {
        title: "二、使用者責任",
        items: [
          "使用者應確保上傳、分析或發布的內容擁有合法使用權。",
          "不得使用本服務侵犯他人著作權、商標權、肖像權、隱私權或其他合法權益。",
          "不得發布詐欺、仇恨、騷擾、誤導、違法或平台政策禁止的內容。",
          "使用者應自行確認 Facebook、Instagram、TikTok、YouTube 等第三方平台的發布規範。",
        ],
      },
      {
        title: "三、AI 生成內容",
        paragraphs: [
          "AI 生成內容可能需要人工審核與修正。使用者應在發布前檢查內容準確性、合法性與品牌適配度，並在必要時加上 AI 輔助標示。",
          "Veltrix AI 不鼓勵複製第三方影片逐字稿、仿冒真人聲音或肖像，也不支援使用未授權音樂或素材。",
        ],
      },
      {
        title: "四、第三方平台授權",
        paragraphs: [
          "當使用者綁定 Facebook、Instagram 或其他平台時，表示使用者同意依各平台 OAuth 授權流程提供必要權限。使用者可隨時解除綁定或撤銷授權。",
        ],
      },
      {
        title: "五、服務調整與聯絡",
        paragraphs: [
          "我們可能依產品需求、法規或第三方平台政策調整服務內容。若您對服務條款有疑問，請聯絡我們。",
        ],
      },
    ],
  },
  "data-deletion": {
    slug: "data-deletion",
    title: "使用者資料刪除說明",
    eyebrow: "User Data Deletion",
    description:
      "提供使用者移除 Veltrix AI 帳號資料、租戶資料，以及 Facebook / Instagram 授權資料的申請流程。",
    effectiveDate,
    contactEmail,
    metaPurpose: "Meta App 後台 User Data Deletion URL",
    sections: [
      {
        title: "一、如何解除 Facebook / Instagram 授權",
        items: [
          "登入 Facebook，前往設定與隱私中的應用程式與網站。",
          "找到 Veltrix AI 或對應的應用程式名稱。",
          "點選移除或撤銷授權，即可停止 Veltrix AI 透過 Meta 取得後續資料。",
          "回到 Veltrix AI 後台的社群帳號綁定頁，刪除已綁定帳號與 token 紀錄。",
        ],
      },
      {
        title: "二、如何申請刪除平台資料",
        paragraphs: [
          `請使用帳號註冊信箱寄信至 ${contactEmail}，主旨請填寫「Veltrix AI 使用者資料刪除申請」。`,
          "請在信件中提供帳號名稱、租戶名稱、欲刪除的社群平台與可協助驗證身分的資訊。我們會在確認身分後處理刪除請求。",
        ],
      },
      {
        title: "三、刪除範圍",
        items: [
          "平台帳號基本資料與租戶工作區資料。",
          "社群平台綁定紀錄、Access Token、授權狀態與同步紀錄。",
          "可識別使用者的操作紀錄與通知設定。",
          "依法律、資安、帳務或爭議處理需求必須保存的最小必要紀錄，會在保存期限屆滿後刪除。",
        ],
      },
      {
        title: "四、處理時間",
        paragraphs: [
          "我們通常會在收到完整申請後 7 個工作天內回覆，並在合理期間內完成刪除或匿名化處理。若需要更多資訊確認身分，我們會透過申請信箱與您聯繫。",
        ],
      },
      {
        title: "五、資料刪除完成通知",
        paragraphs: [
          "刪除完成後，我們會以 email 通知申請人。若資料已因解除授權或平台保存期限屆滿而不存在，也會回覆說明目前狀態。",
        ],
      },
    ],
  },
};
