"use client";

import { Hash, Plus, Settings2, ShieldCheck, Tags, X } from "lucide-react";

import { SectionTitle } from "@/components/tenant-auto-generate/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  tenantAutoPlatforms,
  tenantPublishRules,
} from "@/data/tenant-automation";
import type {
  TenantAutoPlatform,
  TenantAutomationSettings,
  TenantPublishRule,
} from "@/types/tenant-automation";

type SettingsPanelProps = {
  settings: TenantAutomationSettings;
  isSaving: boolean;
  onSettingsChange: (settings: TenantAutomationSettings) => void;
  onSave: () => void;
};

export function SettingsPanel({
  settings,
  isSaving,
  onSettingsChange,
  onSave,
}: SettingsPanelProps) {
  function updateSettings(nextSettings: Partial<TenantAutomationSettings>) {
    onSettingsChange({ ...settings, ...nextSettings });
  }

  function togglePlatform(platform: TenantAutoPlatform) {
    const exists = settings.targetPlatforms.includes(platform);
    updateSettings({
      targetPlatforms: exists
        ? settings.targetPlatforms.filter((item) => item !== platform)
        : [...settings.targetPlatforms, platform],
    });
  }

  function toggleRule(rule: TenantPublishRule) {
    const exists = settings.publishRules.includes(rule);
    updateSettings({
      publishRules: exists
        ? settings.publishRules.filter((item) => item !== rule)
        : [...settings.publishRules, rule],
    });
  }

  function addTag(type: "industryTags" | "blockedTopics", value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    updateSettings({
      [type]: Array.from(new Set([...settings[type], trimmedValue])),
    });
  }

  function removeTag(type: "industryTags" | "blockedTopics", value: string) {
    updateSettings({
      [type]: settings[type].filter((item) => item !== value),
    });
  }

  return (
    <section className="dashboard-card p-5 md:p-6">
      <div className="flex flex-col gap-5 border-b border-[#E5EAF3] pb-6 md:flex-row md:items-center md:justify-between">
        <SectionTitle
          icon={Settings2}
          title="自動產出設定"
          description="所有設定會送到 API 驗證並保存，不再只是前端狀態。"
        />
        <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-[var(--success)]">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) =>
              updateSettings({ enabled: event.currentTarget.checked })
            }
            className="size-4 rounded border-green-200 accent-[var(--success)]"
          />
          自動產出開關
        </label>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E5EAF3] bg-slate-50/70 p-5">
          <h3 className="font-semibold text-slate-950">每日產出數量</h3>
          <p className="mt-1 text-sm text-slate-500">
            目前設定為每天產出 {settings.dailyCount} 支候選影片
          </p>
          <input
            aria-label="每日產出數量"
            type="range"
            min="1"
            max="10"
            value={settings.dailyCount}
            onChange={(event) =>
              updateSettings({ dailyCount: Number(event.currentTarget.value) })
            }
            className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#2F80ED] to-[#8B5CF6] accent-[var(--primary)]"
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5EAF3] bg-white p-5">
          <h3 className="font-semibold text-slate-950">目標平台</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tenantAutoPlatforms.map((platform) => (
              <label
                key={platform}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5EAF3] bg-slate-50/70 px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F4F9FF]"
              >
                <input
                  type="checkbox"
                  checked={settings.targetPlatforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                  className="size-4 rounded border-slate-300 accent-[var(--primary)]"
                />
                {platform}
              </label>
            ))}
          </div>
        </div>

        <TagEditor
          title="產業關鍵字"
          icon="industry"
          tags={settings.industryTags}
          variant="primary"
          onAdd={(value) => addTag("industryTags", value)}
          onRemove={(value) => removeTag("industryTags", value)}
        />

        <TagEditor
          title="禁用主題"
          icon="blocked"
          tags={settings.blockedTopics}
          variant="danger"
          onAdd={(value) => addTag("blockedTopics", value)}
          onRemove={(value) => removeTag("blockedTopics", value)}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-[#E5EAF3] bg-slate-50/70 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-green-50 text-[var(--success)]">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">發布規則</h3>
            <p className="mt-1 text-sm text-slate-500">
              server-side 會保存並套用到產出與排程流程。
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tenantPublishRules.map((rule) => (
            <label
              key={rule}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5EAF3] bg-white px-4 py-3 text-sm font-medium text-slate-700"
            >
              <input
                type="checkbox"
                checked={settings.publishRules.includes(rule)}
                onChange={() => toggleRule(rule)}
                className="size-4 rounded border-slate-300 accent-[var(--success)]"
              />
              {rule}
            </label>
          ))}
        </div>
      </div>

      <Button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="mt-6 h-11 rounded-[14px] bg-[var(--primary)] px-5 text-white hover:bg-[#256FCE]"
      >
        {isSaving ? "保存中..." : "保存設定"}
      </Button>
    </section>
  );
}

function TagEditor({
  title,
  icon,
  tags,
  variant,
  onAdd,
  onRemove,
}: {
  title: string;
  icon: "industry" | "blocked";
  tags: string[];
  variant: "primary" | "danger";
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-[#E5EAF3] bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        {icon === "industry" ? (
          <Hash aria-hidden="true" className="size-4 text-slate-400" />
        ) : (
          <Tags aria-hidden="true" className="size-4 text-slate-400" />
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={
              variant === "primary"
                ? "h-8 rounded-full border-blue-100 bg-[#EAF3FF] px-3 text-[var(--primary)]"
                : "h-8 rounded-full border-red-100 bg-red-50 px-3 text-[var(--danger)]"
            }
          >
            {tag}
            <button type="button" onClick={() => onRemove(tag)} className="ml-1">
              <X aria-hidden="true" className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onAdd(String(formData.get("tag") ?? ""));
          event.currentTarget.reset();
        }}
      >
        <Input name="tag" placeholder={`新增${title}`} className="h-10 rounded-xl bg-white" />
        <Button type="submit" variant="outline" className="h-10 rounded-xl">
          <Plus aria-hidden="true" className="size-4" />
        </Button>
      </form>
    </div>
  );
}
