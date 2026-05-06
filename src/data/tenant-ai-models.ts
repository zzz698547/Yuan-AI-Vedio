import type { ModelFeatureBinding } from "@/types/integrations";
import type {
  TenantAiBindingStep,
  TenantAiMetric,
  TenantAiProviderHighlight,
} from "@/types/tenant-ai-model";

export const tenantAiProviderIds = ["openai", "gemini"] as const;

export const tenantAiMetrics: TenantAiMetric[] = [
  {
    label: "可綁定 Provider",
    value: "2",
    description: "OpenAI 與 Gemini",
    tone: "blue",
  },
  {
    label: "功能路由",
    value: "7",
    description: "腳本、分析、字幕與生成",
    tone: "green",
  },
  {
    label: "Key 儲存方式",
    value: "手動",
    description: "租戶工作區獨立管理",
    tone: "purple",
  },
  {
    label: "驗證模式",
    value: "真實",
    description: "呼叫 Provider Models API",
    tone: "orange",
  },
];

export const tenantAiProviderHighlights: TenantAiProviderHighlight[] = [
  {
    providerId: "openai",
    title: "OpenAI",
    description:
      "適合腳本生成、品牌語氣校正、字幕整理、CTA 變體與短影音企劃。",
    useCases: ["腳本生成", "字幕生成", "品牌語氣", "文案改寫"],
  },
  {
    providerId: "gemini",
    title: "Gemini",
    description:
      "適合視覺理解、參考影片摘要、多模態分析與長內容結構化整理。",
    useCases: ["視覺分析", "參考影片分析", "素材理解", "多模態判斷"],
  },
];

export const tenantAiModelFeatures: ModelFeatureBinding[] = [
  {
    feature: "腳本生成",
    currentModel: "OpenAI GPT-5.2",
    fallbackModel: "Gemini 2.5 Pro",
    estimatedCost: "$0.018",
    status: "待設定",
  },
  {
    feature: "參考影片分析",
    currentModel: "Gemini 2.5 Pro",
    fallbackModel: "OpenAI GPT-5.2 Vision",
    estimatedCost: "$0.026",
    status: "待設定",
  },
  {
    feature: "字幕生成",
    currentModel: "OpenAI Transcribe",
    fallbackModel: "Gemini 2.0 Flash",
    estimatedCost: "$0.009",
    status: "待設定",
  },
  {
    feature: "圖片生成",
    currentModel: "OpenAI Image",
    fallbackModel: "Gemini Image",
    estimatedCost: "$0.035",
    status: "待設定",
  },
  {
    feature: "語音生成",
    currentModel: "OpenAI TTS",
    fallbackModel: "Gemini TTS",
    estimatedCost: "$0.014",
    status: "待設定",
  },
  {
    feature: "影片生成",
    currentModel: "Gemini 2.5 Pro",
    fallbackModel: "OpenAI GPT-5.2",
    estimatedCost: "$0.180",
    status: "待設定",
  },
  {
    feature: "自動剪輯",
    currentModel: "Gemini 2.0 Flash",
    fallbackModel: "OpenAI GPT-5.2",
    estimatedCost: "$0.052",
    status: "待設定",
  },
];

export const tenantAiBindingSteps: TenantAiBindingStep[] = [
  {
    title: "貼上 API Key",
    description: "由租戶自行輸入 OpenAI 或 Gemini 的 API Key，系統只顯示遮罩。",
  },
  {
    title: "測試真實連線",
    description: "點擊測試後會呼叫 Provider Models API，確認 Key 是否可用。",
  },
  {
    title: "分配功能模型",
    description: "設定每個 AI 功能的主要模型與備援模型，降低生成中斷風險。",
  },
];
