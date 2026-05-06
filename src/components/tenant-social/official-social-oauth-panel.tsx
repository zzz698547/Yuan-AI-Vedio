"use client";

import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/integrations/status-badge";
import { FacebookLoginStatusCard } from "@/components/tenant-social/facebook-login-status-card";
import { Button } from "@/components/ui/button";
import type {
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

type OfficialSocialOAuthPanelProps = {
  platforms: SocialPlatformBinding[];
  pendingPlatform: SocialPlatformId | null;
  syncingPlatform: SocialPlatformId | null;
  onAuthorize: (platform: SocialPlatformId) => void;
  onSync: (platform: SocialPlatformId) => void;
};

export function OfficialSocialOAuthPanel({
  platforms,
  pendingPlatform,
  syncingPlatform,
  onAuthorize,
  onSync,
}: OfficialSocialOAuthPanelProps) {
  return (
    <section className="dashboard-card">
      <div className="flex items-center gap-3">
        <div className="icon-bubble">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">正式平台授權</h2>
          <p className="text-sm text-muted-foreground">
            連到官方 OAuth 授權頁，由平台回傳授權碼完成綁定。
          </p>
        </div>
      </div>

      <FacebookLoginStatusCard />

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {platforms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-6 text-center md:col-span-2">
            <p className="font-semibold text-foreground">平台資料載入中</p>
            <p className="mt-2 text-sm text-muted-foreground">
              請稍候，系統正在準備可授權平台。
            </p>
          </div>
        ) : (
          platforms.map((platform) => (
            <article
              key={platform.id}
              className="min-w-0 rounded-2xl border border-border bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <p className="font-bold text-foreground">{platform.name}</p>
                <StatusBadge status={platform.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                已綁定 {platform.connectedCount} 個帳號
              </p>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
                {platform.lastMessage ?? getScopeSummary(platform)}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={platform.status === "已驗證" ? "outline" : "default"}
                  disabled={pendingPlatform === platform.id}
                  onClick={() => onAuthorize(platform.id)}
                  className="h-10 rounded-xl"
                >
                  <ExternalLink data-icon="inline-start" />
                  {pendingPlatform === platform.id ? "授權中" : "正式授權"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={syncingPlatform === platform.id}
                  onClick={() => onSync(platform.id)}
                  className="h-10 rounded-xl"
                >
                  <RefreshCw data-icon="inline-start" />
                  {syncingPlatform === platform.id ? "同步中" : "同步"}
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function getScopeSummary(platform: SocialPlatformBinding) {
  if (platform.id === "facebook" || platform.id === "instagram") {
    return "目前使用基本登入權限 public_profile, email；粉專發布與洞察權限需 Meta App Review 通過後開啟。";
  }

  return platform.scopes.join(", ");
}
