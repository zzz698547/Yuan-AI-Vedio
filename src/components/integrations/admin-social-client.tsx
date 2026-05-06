"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BadgeCheck, Clock3, RefreshCw, Share2 } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/integrations/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchSocialIntegrations,
  startSocialOAuth,
  syncSocialPlatform,
} from "@/lib/integrations-api";
import type {
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

export function AdminSocialClient() {
  const [platforms, setPlatforms] = useState<SocialPlatformBinding[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountBinding[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pendingPlatform, setPendingPlatform] = useState<SocialPlatformId | null>(null);

  useEffect(() => {
    let isActive = true;

    fetchSocialIntegrations()
      .then((result) => {
        if (!isActive) {
          return;
        }

        setPlatforms(result.data.platforms);
        setAccounts(result.data.accounts);
      })
      .catch((loadError) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "社群資料載入失敗。");
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleOAuth(platformId: SocialPlatformId) {
    await runPlatformAction(platformId, startSocialOAuth);
  }

  async function handleSync(platformId: SocialPlatformId) {
    await runPlatformAction(platformId, syncSocialPlatform);
  }

  async function runPlatformAction(
    platformId: SocialPlatformId,
    action: typeof startSocialOAuth
  ) {
    setPendingPlatform(platformId);
    setNotice("");
    setError("");

    try {
      const result = await action(platformId);
      setPlatforms(result.data.platforms);
      setAccounts(result.data.accounts);
      setNotice(result.message ?? "社群平台操作完成。");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "社群平台操作失敗。");
    } finally {
      setPendingPlatform(null);
    }
  }

  const connectedCount = accounts.length;
  const permissionOkCount = accounts.filter(
    (account) => account.permissionStatus === "可發文" || account.permissionStatus === "可上傳"
  ).length;
  const tokenExpiringCount = accounts.filter(
    (account) => account.tokenStatus === "即將過期"
  ).length;

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          社群帳號綁定
        </h1>
        <p className="text-sm font-medium text-muted-foreground md:text-base">
          OAuth 會檢查實際環境變數，不再用假綁定狀態。
        </p>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-success">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="已綁定帳號" value={connectedCount} change="真實 OAuth 統計" changeType="increase" color="blue" icon={<Share2 />} />
        <StatCard title="發文權限正常" value={permissionOkCount} change="依 token 權限" changeType="increase" color="green" icon={<BadgeCheck />} />
        <StatCard title="Token 即將過期" value={tokenExpiringCount} change="等待同步" changeType="increase" color="orange" icon={<Clock3 />} />
        <StatCard title="未完成綁定" value={platforms.filter((item) => item.status !== "已驗證").length} change="需要 OAuth" changeType="decrease" color="red" icon={<AlertTriangle />} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {platforms.map((platform) => (
          <article key={platform.id} className="dashboard-card dashboard-card-hover flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{platform.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  已綁定 {platform.connectedCount} 個帳號
                </p>
              </div>
              <StatusBadge status={platform.status} />
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-xs font-semibold text-muted-foreground">權限</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                {platform.scopes.join(", ")}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {platform.lastMessage ?? `${platform.clientIdEnv} / ${platform.clientSecretEnv}`}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={pendingPlatform === platform.id}
                onClick={() => handleOAuth(platform.id)}
                className="rounded-xl"
              >
                <RefreshCw data-icon="inline-start" />
                {pendingPlatform === platform.id ? "處理中..." : "開始 OAuth"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={pendingPlatform === platform.id}
                onClick={() => handleSync(platform.id)}
                className="rounded-xl"
              >
                重新同步
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-card overflow-hidden">
        <div className="mb-5">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            已綁定帳號
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            OAuth callback 完成後才會出現真實帳號。
          </p>
        </div>
        <AccountsTable accounts={accounts} />
      </section>
    </div>
  );
}

function AccountsTable({ accounts }: { accounts: SocialAccountBinding[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>平台</TableHead>
            <TableHead>帳號名稱</TableHead>
            <TableHead>所屬租戶</TableHead>
            <TableHead>Token 狀態</TableHead>
            <TableHead>發文權限</TableHead>
            <TableHead>最近同步</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                <p className="font-semibold text-foreground">尚無真實綁定帳號</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  請先設定平台 OAuth 環境變數並完成 callback。
                </p>
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-semibold text-foreground">
                  {account.platform}
                </TableCell>
                <TableCell>{account.accountName}</TableCell>
                <TableCell>{account.tenantName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{account.tokenStatus}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{account.permissionStatus}</Badge>
                </TableCell>
                <TableCell>{account.syncedAt ?? "尚未同步"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
