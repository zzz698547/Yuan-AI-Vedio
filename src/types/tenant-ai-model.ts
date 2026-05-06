import type { AiProviderId } from "@/types/integrations";

export type TenantAiMetricTone = "blue" | "green" | "purple" | "orange";

export type TenantAiMetric = {
  label: string;
  value: string;
  description: string;
  tone: TenantAiMetricTone;
};

export type TenantAiProviderHighlight = {
  providerId: Extract<AiProviderId, "openai" | "gemini">;
  title: string;
  description: string;
  useCases: string[];
};

export type TenantAiBindingStep = {
  title: string;
  description: string;
};
