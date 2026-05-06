import {
  maskSecret,
  testAiProviderConnection,
  type IntegrationState,
} from "@/lib/integration-service";
import type {
  AiProviderBinding,
  AiProviderId,
  ModelFeatureBinding,
} from "@/types/integrations";

export type AiModelPayload = {
  providers: AiProviderBinding[];
  modelFeatures: ModelFeatureBinding[];
};

export function bindAiProvider(
  integrations: IntegrationState,
  payload: {
    providerId: AiProviderId;
    apiKey: string;
  }
) {
  const apiKey = payload.apiKey.trim();

  if (apiKey.length < 8) {
    throw new Error("API Key 至少需要 8 個字元。");
  }

  const provider = findProvider(integrations, payload.providerId);
  const savedAt = new Date().toISOString();

  integrations.aiProviderSecrets = [
    {
      providerId: payload.providerId,
      apiKey,
      savedAt,
      source: "manual",
    },
    ...integrations.aiProviderSecrets.filter(
      (secret) => secret.providerId !== payload.providerId
    ),
  ];
  integrations.aiProviders = integrations.aiProviders.map((item) =>
    item.id === payload.providerId
      ? {
          ...provider,
          status: "已設定",
          maskedKey: maskSecret(apiKey),
          bindingSource: "manual",
          lastTestedAt: savedAt,
          lastMessage: "API Key 已儲存，請執行測試連線完成驗證。",
        }
      : item
  );

  return getAiModelPayload(integrations);
}

export function unbindAiProvider(
  integrations: IntegrationState,
  providerId: AiProviderId
) {
  const provider = findProvider(integrations, providerId);
  const envKey = process.env[provider.envKey];

  integrations.aiProviderSecrets = integrations.aiProviderSecrets.filter(
    (secret) => secret.providerId !== providerId
  );
  integrations.aiProviders = integrations.aiProviders.map((item) =>
    item.id === providerId
      ? {
          ...provider,
          status: envKey ? "已設定" : "未設定",
          maskedKey: envKey ? maskSecret(envKey) : "尚未設定",
          bindingSource: envKey ? "env" : undefined,
          lastMessage: envKey
            ? `已移除手動 API Key，改用 ${provider.envKey}。`
            : "已解除綁定，請重新輸入 API Key。",
          lastTestedAt: new Date().toISOString(),
        }
      : item
  );

  return getAiModelPayload(integrations);
}

export async function testAiProvider(
  integrations: IntegrationState,
  providerId: AiProviderId
) {
  const provider = findProvider(integrations, providerId);
  const secret = integrations.aiProviderSecrets.find(
    (item) => item.providerId === providerId
  );
  const apiKey = secret?.apiKey ?? process.env[provider.envKey];
  const testedProvider = await testAiProviderConnection(provider, apiKey);

  integrations.aiProviders = integrations.aiProviders.map((item) =>
    item.id === testedProvider.id
      ? {
          ...testedProvider,
          bindingSource: secret ? "manual" : apiKey ? "env" : undefined,
        }
      : item
  );

  return {
    provider: integrations.aiProviders.find((item) => item.id === providerId),
    ...getAiModelPayload(integrations),
  };
}

export function updateModelFeature(
  integrations: IntegrationState,
  payload: ModelFeatureBinding
) {
  const currentModel = payload.currentModel.trim();
  const fallbackModel = payload.fallbackModel.trim();
  const estimatedCost = payload.estimatedCost.trim();

  if (!payload.feature.trim() || !currentModel || !fallbackModel || !estimatedCost) {
    throw new Error("功能、模型與成本皆為必填。");
  }

  integrations.modelFeatures = integrations.modelFeatures.map((feature) =>
    feature.feature === payload.feature
      ? {
          feature: payload.feature,
          currentModel,
          fallbackModel,
          estimatedCost,
          status: payload.status,
        }
      : feature
  );

  return getAiModelPayload(integrations);
}

export function getAiModelPayload(integrations: IntegrationState): AiModelPayload {
  const providers = integrations.aiProviders.map((provider) => {
    const secret = integrations.aiProviderSecrets.find(
      (item) => item.providerId === provider.id
    );
    const envKey = process.env[provider.envKey];

    if (secret) {
      return {
        ...provider,
        maskedKey: maskSecret(secret.apiKey),
        bindingSource: "manual" as const,
      };
    }

    if (envKey && provider.maskedKey === "尚未設定") {
      return {
        ...provider,
        status: "已設定" as const,
        maskedKey: maskSecret(envKey),
        bindingSource: "env" as const,
        lastMessage: `已偵測到 ${provider.envKey}，可測試連線。`,
      };
    }

    return provider;
  });

  integrations.aiProviders = providers;

  return {
    providers,
    modelFeatures: integrations.modelFeatures,
  };
}

function findProvider(integrations: IntegrationState, providerId: AiProviderId) {
  const provider = integrations.aiProviders.find((item) => item.id === providerId);

  if (!provider) {
    throw new Error("找不到 AI Provider。");
  }

  return provider;
}
