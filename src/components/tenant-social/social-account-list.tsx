"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  SocialAccountBinding,
  SocialPlatformBinding,
} from "@/types/integrations";

type SocialAccountListProps = {
  accounts: SocialAccountBinding[];
  platforms: SocialPlatformBinding[];
  isDeleting: boolean;
  deletingAccountId: string;
  onDeleteAll: () => void;
  onDeleteAccount: (accountId: string) => void;
};

export function SocialAccountList({
  accounts,
  platforms,
  isDeleting,
  deletingAccountId,
  onDeleteAll,
  onDeleteAccount,
}: SocialAccountListProps) {
  return (
    <section className="dashboard-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">已綁定帳號</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {accounts.length} 個帳號，刪除後會同步清除 token 與平台連線狀態。
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={accounts.length === 0 || isDeleting}
          onClick={onDeleteAll}
          className="h-10 rounded-xl"
        >
          <Trash2 data-icon="inline-start" />
          {isDeleting ? "刪除中..." : "全部刪除"}
        </Button>
      </div>
      <div className="mt-5 grid gap-3">
        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center">
            <p className="font-semibold text-foreground">尚未綁定社群帳號</p>
            <p className="mt-2 text-sm text-muted-foreground">
              使用官方 OAuth 正式授權或手動輸入 Token，即可建立第一個綁定。
            </p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="grid min-w-0 gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <div>
                <p className="text-xs font-semibold text-muted-foreground">平台</p>
                <p className="mt-1 font-bold text-foreground">
                  {getPlatformName(account, platforms)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">帳號</p>
                <p className="mt-1 break-words font-bold text-foreground">
                  {account.accountName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Token</p>
                <p className="mt-1 font-mono text-sm font-bold text-foreground">
                  {account.tokenMasked ?? "****"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{account.bindingMethod ?? "Manual"}</Badge>
                <Badge variant="outline">{account.tokenStatus}</Badge>
                <Badge variant="outline">{account.permissionStatus}</Badge>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deletingAccountId === account.id}
                  onClick={() => onDeleteAccount(account.id)}
                  className="rounded-xl"
                >
                  <Trash2 data-icon="inline-start" />
                  {deletingAccountId === account.id ? "刪除中" : "刪除"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function getPlatformName(
  account: SocialAccountBinding,
  platforms: SocialPlatformBinding[]
) {
  return (
    platforms.find((platform) => platform.id === account.platform)?.name ??
    account.platform
  );
}
