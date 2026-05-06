"use client";

import { useEffect, useState } from "react";

import { AiFeatureTable } from "@/components/integrations/ai-feature-table";
import { AiProviderCard } from "@/components/integrations/ai-provider-card";
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

export function AdminAiModelsClient() {
  const [providers, setProviders] = useState<AiProviderBinding[]>([]);
  const [features, setFeatures] = useState<ModelFeatureBinding[]>([]);
  const [providerKeys, setProviderKeys] = useState<ProviderKeys>({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [testingProvider, setTestingProvider] = useState<AiProviderId | null>(null);
  const [savingProvider, setSavingProvider] = useState<AiProviderId | null>(null);
  const [savingFeature, setSavingFeature] = useState("");

  useEffect(() => {
    let isActive = true;

    queueMicrotask(async () => {
      try {
        const result = await fetchAiModels();

        if (!isActive) {
          return;
        }

        setProviders(result.data.providers);
        setFeatures(result.data.modelFeatures);
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error ? loadError.message : "AI 模型資料載入失敗。"
          );
        }
      }
    });

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
    if (!window.confirm("確定要解除這個 AI Provider 綁定嗎？")) {
      return;
    }

    setSavingProvider(providerId);
    resetMessage();

    try {
      const result = await unbindAiProvider(providerId);
      applyAiPayload(result.data.providers, result.data.modelFeatures);
      setNotice(result.message ?? "AI Provider 已解除綁定。");
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

  function applyAiPayload(
    nextProviders: AiProviderBinding[],
    nextFeatures: ModelFeatureBinding[]
  ) {
    setProviders(nextProviders);
    setFeatures(nextFeatures);
  }

  function resetMessage() {
    setNotice("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          AI 模型綁定
        </h1>
        <p className="text-sm font-medium leading-7 text-muted-foreground md:text-base">
          可手動綁定 Provider API Key、測試真實連線，並設定各 AI 功能使用的模型。
        </p>
      </section>

      {notice ? <StatusMessage tone="success" message={notice} /> : null}
      {error ? <StatusMessage tone="danger" message={error} /> : null}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
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

      <AiFeatureTable
        features={features}
        savingFeature={savingFeature}
        onSave={handleSaveFeature}
      />
    </div>
  );
}

function StatusMessage({
  tone,
  message,
}: {
  tone: "success" | "danger";
  message: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-green-100 bg-green-50 text-success"
      : "border-red-100 bg-red-50 text-danger";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass}`}>
      {message}
    </div>
  );
}
