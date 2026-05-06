"use client";

import type { FormEvent } from "react";
import { KeyRound, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SocialPlatformBinding } from "@/types/integrations";

type ManualSocialBindFormProps = {
  platforms: SocialPlatformBinding[];
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ManualSocialBindForm({
  platforms,
  isSubmitting,
  onSubmit,
}: ManualSocialBindFormProps) {
  const hasPlatforms = platforms.length > 0;

  return (
    <form onSubmit={onSubmit} className="dashboard-card flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="icon-bubble">
          <KeyRound aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">手動新增綁定</h2>
          <p className="text-sm text-muted-foreground">
            進階使用，可輸入平台帳號與既有 Access Token。
          </p>
        </div>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-foreground">平台</span>
        <select
          name="platform"
          disabled={!hasPlatforms}
          className="h-11 rounded-[14px] border border-border bg-white px-3 text-sm font-medium text-foreground transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted-foreground"
        >
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-foreground">帳號名稱</span>
        <Input
          name="accountName"
          placeholder="例如：Veltrix AI 官方帳號"
          className="h-11 rounded-[14px]"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-foreground">Access Token</span>
        <Input
          name="accessToken"
          type="password"
          placeholder="貼上平台 Access Token"
          className="h-11 rounded-[14px]"
        />
      </label>

      <Button
        type="submit"
        disabled={isSubmitting || !hasPlatforms}
        className="h-11 rounded-[14px]"
      >
        <Link2 data-icon="inline-start" />
        {isSubmitting ? "綁定中..." : "手動綁定"}
      </Button>
    </form>
  );
}
