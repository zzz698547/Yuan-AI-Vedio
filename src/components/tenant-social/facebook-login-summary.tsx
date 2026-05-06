"use client";

import { CheckCircle2, LogIn, RefreshCw, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { facebookLoginStatusCopy } from "@/data/facebook-login-status-copy";
import type {
  FacebookLoginStatusResponse,
  FacebookLoginUiStatus,
} from "@/types/facebook-sdk";

type FacebookLoginSummaryProps = {
  appId?: string;
  isChecking: boolean;
  loginResponse: FacebookLoginStatusResponse | null;
  onCheck: () => void;
  onLogin: () => void;
  status: FacebookLoginUiStatus;
};

export function FacebookLoginSummary({
  appId,
  isChecking,
  loginResponse,
  onCheck,
  onLogin,
  status,
}: FacebookLoginSummaryProps) {
  const copy = facebookLoginStatusCopy[isChecking ? "checking" : status];
  const isConnected = loginResponse?.status === "connected";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-3">
        <div className="icon-bubble text-primary">
          {isConnected ? (
            <CheckCircle2 aria-hidden="true" className="size-5" />
          ) : (
            <ShieldAlert aria-hidden="true" className="size-5" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">Facebook 登入狀態</h3>
            <Badge className={copy.toneClass}>{copy.badge}</Badge>
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {copy.label}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {copy.description}
          </p>
          {isConnected ? (
            <p className="mt-2 text-xs text-muted-foreground">
              User ID：{loginResponse.authResponse?.userID}，Access Token 已取得但不會顯示在畫面上。
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={!appId || isChecking}
          onClick={onCheck}
          className="h-10 rounded-xl"
        >
          <RefreshCw data-icon="inline-start" />
          重新檢查
        </Button>
        <Button
          type="button"
          disabled={!appId || isChecking}
          onClick={onLogin}
          className="h-10 rounded-xl"
        >
          <LogIn data-icon="inline-start" />
          使用 Facebook 登入
        </Button>
      </div>
    </div>
  );
}
