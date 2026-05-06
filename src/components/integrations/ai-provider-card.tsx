"use client";

import { Bot, KeyRound, Save, TestTube2, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/integrations/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiProviderBinding, AiProviderId } from "@/types/integrations";

type AiProviderCardProps = {
  provider: AiProviderBinding;
  apiKey: string;
  isTesting: boolean;
  isSaving: boolean;
  onApiKeyChange: (providerId: AiProviderId, value: string) => void;
  onSave: (providerId: AiProviderId) => void;
  onTest: (providerId: AiProviderId) => void;
  onUnbind: (providerId: AiProviderId) => void;
};

export function AiProviderCard({
  provider,
  apiKey,
  isTesting,
  isSaving,
  onApiKeyChange,
  onSave,
  onTest,
  onUnbind,
}: AiProviderCardProps) {
  const pending = isTesting || isSaving;

  return (
    <article className="dashboard-card dashboard-card-hover flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="icon-bubble">
            <Bot aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{provider.name}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {provider.purpose}
            </p>
          </div>
        </div>
        <StatusBadge status={provider.status} />
      </div>

      <div className="rounded-2xl border border-border bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <KeyRound aria-hidden="true" className="size-4" />
          {provider.envKey}
        </div>
        <p className="mt-2 font-mono text-sm font-semibold text-foreground">
          {provider.maskedKey}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          來源：{getBindingSourceLabel(provider)}
        </p>
        {provider.lastMessage ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {provider.lastMessage}
          </p>
        ) : null}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-foreground">API Key</span>
        <Input
          type="password"
          value={apiKey}
          onChange={(event) => onApiKeyChange(provider.id, event.target.value)}
          placeholder="貼上 API Key 後儲存"
          className="h-11 rounded-[14px]"
        />
      </label>

      <div className="mt-auto grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          disabled={pending}
          onClick={() => onSave(provider.id)}
          className="rounded-xl"
        >
          <Save data-icon="inline-start" />
          儲存
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => onTest(provider.id)}
          className="rounded-xl"
        >
          <TestTube2 data-icon="inline-start" />
          {isTesting ? "驗證中" : "測試"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={pending}
          onClick={() => onUnbind(provider.id)}
          className="rounded-xl"
        >
          <Trash2 data-icon="inline-start" />
          解除
        </Button>
      </div>
    </article>
  );
}

function getBindingSourceLabel(provider: AiProviderBinding) {
  if (provider.bindingSource === "manual") {
    return "後台手動綁定";
  }

  if (provider.bindingSource === "env") {
    return "環境變數";
  }

  return "尚未綁定";
}
