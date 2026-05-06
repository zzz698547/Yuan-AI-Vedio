"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Bot } from "lucide-react";

import { CandidatesTable } from "@/components/tenant-auto-generate/candidates-table";
import { InsightsSidebar } from "@/components/tenant-auto-generate/insights-sidebar";
import { SettingsPanel } from "@/components/tenant-auto-generate/settings-panel";
import { StatusCards } from "@/components/tenant-auto-generate/status-cards";
import {
  fetchTenantAutomation,
  generateTenantCandidates,
  saveTenantAutomationSettings,
  updateTenantCandidate,
} from "@/lib/tenant-auto-generate-api";
import { getMockSession } from "@/lib/mock-auth";
import type {
  TenantAutomationSettings,
  TenantAutomationState,
  TenantCandidateAction,
} from "@/types/tenant-automation";

function subscribeToSession(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getTenantIdSnapshot() {
  return getMockSession()?.tenantId || "default-tenant";
}

export function AutoGenerateClient() {
  const tenantId = useSyncExternalStore(
    subscribeToSession,
    getTenantIdSnapshot,
    () => "default-tenant"
  );
  const [automation, setAutomation] = useState<TenantAutomationState | null>(null);
  const [settingsDraft, setSettingsDraft] =
    useState<TenantAutomationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetchTenantAutomation(tenantId)
      .then((result) => {
        if (!isActive) {
          return;
        }

        setAutomation(result.data);
        setSettingsDraft(result.data.settings);
        setError("");
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : "自動產出資料載入失敗。"
        );
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [tenantId]);

  async function handleSaveSettings() {
    if (!settingsDraft) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const result = await saveTenantAutomationSettings(tenantId, settingsDraft);
      setAutomation(result.data);
      setSettingsDraft(result.data.settings);
      setNotice(result.message ?? "設定已保存。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "設定保存失敗。");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");

    try {
      const result = await generateTenantCandidates(tenantId);
      setAutomation(result.data);
      setSettingsDraft(result.data.settings);
      setNotice(result.message ?? "已產生候選影片。");
    } catch (generateError) {
      setError(
        generateError instanceof Error ? generateError.message : "產生候選影片失敗。"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCandidateAction(
    candidateId: string,
    action: TenantCandidateAction
  ) {
    setIsMutating(true);
    setError("");

    try {
      const result = await updateTenantCandidate(tenantId, candidateId, action);
      setAutomation(result.data);
      setSettingsDraft(result.data.settings);
      setNotice(result.message ?? "候選影片狀態已更新。");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "操作失敗。");
    } finally {
      setIsMutating(false);
    }
  }

  if (isLoading || !automation || !settingsDraft) {
    return (
      <div className="dashboard-card p-8 text-sm font-semibold text-slate-500">
        正在載入自動產出 API 資料...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8E8FF] bg-[#EAF3FF] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          <Bot aria-hidden="true" className="size-3.5" />
          Autonomous Content Engine
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          每日自動產出
        </h1>
        <p className="text-sm text-slate-500 md:text-base">
          設定、產生、審核與排程都已接到本機 API，具備真實驗證與狀態更新。
        </p>
      </div>

      {notice ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-[var(--success)]">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <StatusCards state={automation} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-12">
        <main className="min-w-0 space-y-6 xl:col-span-8">
          <SettingsPanel
            settings={settingsDraft}
            isSaving={isSaving}
            onSettingsChange={setSettingsDraft}
            onSave={handleSaveSettings}
          />
          <CandidatesTable
            candidates={automation.candidateVideos}
            isGenerating={isGenerating}
            isMutating={isMutating}
            onGenerate={handleGenerate}
            onAction={handleCandidateAction}
          />
        </main>

        <InsightsSidebar
          trends={automation.trends}
          suggestions={automation.aiSuggestions}
        />
      </div>
    </div>
  );
}
