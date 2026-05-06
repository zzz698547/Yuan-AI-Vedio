"use client";

import { useEffect, useState } from "react";

import { AiFeatureTable } from "@/components/integrations/ai-feature-table";
import { AiProviderCard } from "@/components/integrations/ai-provider-card";
import {
  TenantAiProviderLoadingGrid,
  TenantAiStatusMessage,
} from "@/components/tenant-ai-models/tenant-ai-models-feedback";
import {
  TenantAiBindingChecklist,
  TenantAiProviderHighlights,
} from "@/components/tenant-ai-models/tenant-ai-models-guidance";
import {
  TenantAiMetricCards,
  TenantAiModelsHeader,
} from "@/components/tenant-ai-models/tenant-ai-models-overview";
import {
  tenantAiModelFeatures,
  tenantAiProviderIds,
} from "@/data/tenant-ai-models";
import {
  bindAiProvider,
  fetchAiModels,
  testAiProvider,
  unbindAiProvider,
  updateAiModelFeature,
} from "@/lib/integrations-api";
import type {
  AiProviderBinding,
  AiProviderId,
  ModelFeatureBinding,
} from "@/types/integrations";

type ProviderKeys = Partial<Record<AiProviderId, string>>;
type TenantProviderId = (typeof tenantAiProviderIds)[number];

const tenantFeatureNames = tenantAiModelFeatures.map((feature) => feature.feature);

export function TenantAiModelsClient() {
  const [providers, setProviders] = useState<AiProviderBinding[]>([]);
  const [features, setFeatures] = useState<ModelFeatureBinding[]>([]);
  const [providerKeys, setProviderKeys] = useState<ProviderKeys>({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [testingProvider, setTestingProvider] = useState<AiProviderId | null>(null);
  const [savingProvider, setSavingProvider] = useState<AiProviderId | null>(null);
  const [savingFeature, setSavingFeature] = useState("");

  function applyAiPayload(
    nextProviders: AiProviderBinding[],
    nextFeatures: ModelFeatureBinding[]
  ) {
    setProviders(nextProviders.filter(isTenantProvider));
    setFeatures(normalizeTenantFeatures(nextFeatures));
  }

  function resetMessage() {
    setNotice("");
    setError("");
  }

  useEffect(() => {
    let isActive = true;

    async function loadAiModels() {
      try {
        const result = await fetchAiModels();

        if (isActive) {
          applyAiPayload(result.data.providers, result.data.modelFeatures);
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error ? loadError.message : "AI 模型資料載入失敗。"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAiModels();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSave(providerId: AiProviderId) {
    setSavingProvider(providerId);
    resetMessage();

    try {
      const result = await bindAiProvider({
        providerId,
        apiKey: providerKeys[providerId] ?? "",
      });
      applyAiPayload(result.data.providers, result.data.modelFeatures);
      setProviderKeys((current) => ({ ...current, [providerId]: "" }));
      setNotice(result.message ?? "API Key 已儲存。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "API Key 儲存失敗。");
    } finally {
      setSavingProvider(null);
    }
  }

  async function handleTest(providerId: AiProviderId) {
    setTestingProvider(providerId);
    resetMessage();

    try {
      const result = await testAiProvider(providerId);
      applyAiPayload(result.data.providers, result.data.modelFeatures);
      setNotice(result.message ?? "Provider 測試完成。");
    } catch (testError) {
      setError(testError instanceof Error ? testError.message : "Provider 測試失敗。");
    } finally {
      setTestingProvider(null);
    }
  }

  async function handleUnbind(providerId: AiProviderId) {
    if (!window.confirm("確定要解除這個 AI 模型綁定嗎？")) {
      return;
    }

    setSavingProvider(providerId);
    resetMessage();

    try {
      const result = await unbindAiProvider(providerId);
      applyAiPayload(result.data.providers, result.data.modelFeatures);
      setNotice(result.message ?? "AI 模型已解除綁定。");
    } catch (unbindError) {
      setError(unbindError instanceof Error ? unbindError.message : "解除綁定失敗。");
    } finally {
      setSavingProvider(null);
    }
  }

  async function handleSaveFeature(feature: ModelFeatureBinding) {
    setSavingFeature(feature.feature);
    resetMessage();

    try {
      const result = await updateAiModelFeature(feature);
      applyAiPayload(result.data.providers, result.data.modelFeatures);
      setNotice(result.message ?? "模型用途設定已更新。");
    } catch (featureError) {
      setError(featureError instanceof Error ? featureError.message : "模型用途更新失敗。");
    } finally {
      setSavingFeature("");
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <TenantAiModelsHeader
        isLoading={isLoading}
        onRefresh={() => window.location.reload()}
      />
      <TenantAiMetricCards />

      {notice ? <TenantAiStatusMessage tone="success" message={notice} /> : null}
      {error ? <TenantAiStatusMessage tone="danger" message={error} /> : null}

      {isLoading ? (
        <TenantAiProviderLoadingGrid />
      ) : (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {providers.map((provider) => (
            <AiProviderCard
              key={provider.id}
              provider={provider}
              apiKey={providerKeys[provider.id] ?? ""}
              isTesting={testingProvider === provider.id}
              isSaving={savingProvider === provider.id}
              onApiKeyChange={(providerId, value) =>
                setProviderKeys((current) => ({ ...current, [providerId]: value }))
              }
              onSave={handleSave}
              onTest={handleTest}
              onUnbind={handleUnbind}
            />
          ))}
        </section>
      )}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <AiFeatureTable
            features={features}
            savingFeature={savingFeature}
            onSave={handleSaveFeature}
          />
        </div>
        <TenantAiBindingChecklist />
      </section>

      <TenantAiProviderHighlights providers={providers} />
    </div>
  );
}

function isTenantProvider(provider: AiProviderBinding): provider is AiProviderBinding & {
  id: TenantProviderId;
} {
  return tenantAiProviderIds.some((providerId) => providerId === provider.id);
}

function normalizeTenantFeatures(features: ModelFeatureBinding[]) {
  const featureMap = new Map(features.map((feature) => [feature.feature, feature]));

  return tenantFeatureNames
    .map((featureName) => {
      const defaultFeature = tenantAiModelFeatures.find(
        (feature) => feature.feature === featureName
      );

      return featureMap.get(featureName) ?? defaultFeature;
    })
    .filter((feature): feature is ModelFeatureBinding => Boolean(feature));
}
