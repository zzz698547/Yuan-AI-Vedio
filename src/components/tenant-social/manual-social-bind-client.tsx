"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ManualSocialBindForm } from "@/components/tenant-social/manual-social-bind-form";
import { OfficialSocialOAuthPanel } from "@/components/tenant-social/official-social-oauth-panel";
import { SocialAccountList } from "@/components/tenant-social/social-account-list";
import {
  deleteAllSocialAccounts,
  fetchSocialIntegrations,
  manualBindSocialAccount,
  startTenantSocialOAuth,
} from "@/lib/integrations-api";
import { getMockSession } from "@/lib/mock-auth";
import {
  getOAuthPopupFeatures,
  readCallbackMessage,
  readOAuthPopupMessage,
  watchPopupClose,
} from "@/lib/social-oauth-client";
import type {
  SocialAccountBinding,
  SocialPlatformBinding,
  SocialPlatformId,
} from "@/types/integrations";

export function ManualSocialBindClient() {
  const [platforms, setPlatforms] = useState<SocialPlatformBinding[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountBinding[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState<SocialPlatformId | null>(
    null
  );

  async function loadSocialData(isActive: boolean) {
    try {
      const result = await fetchSocialIntegrations();

      if (!isActive) {
        return;
      }

      setPlatforms(result.data.platforms);
      setAccounts(result.data.accounts);
      const callbackMessage = readCallbackMessage();

      if (callbackMessage?.tone === "success") {
        setNotice(callbackMessage.message);
      }

      if (callbackMessage?.tone === "danger") {
        setError(callbackMessage.message);
      }
    } catch (loadError) {
      if (isActive) {
        setError(
          loadError instanceof Error ? loadError.message : "社群綁定資料載入失敗。"
        );
      }
    }
  }

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      void loadSocialData(isActive);
    });
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const message = readOAuthPopupMessage(event.data);

      if (!message) {
        return;
      }

      setPendingPlatform(null);
      if (message.status === "success") {
        setNotice(message.message);
        setError("");
      } else {
        setError(message.message);
        setNotice("");
      }
      loadSocialData(true);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      isActive = false;
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    resetMessage();

    try {
      const result = await manualBindSocialAccount({
        platform: String(formData.get("platform")) as SocialPlatformId,
        accountName: String(formData.get("accountName") ?? ""),
        tenantName: getTenantName(),
        accessToken: String(formData.get("accessToken") ?? ""),
      });
      applySocialPayload(result.data.platforms, result.data.accounts);
      setNotice(result.message ?? "社群帳號已手動綁定。");
      event.currentTarget.reset();
    } catch (bindError) {
      setError(bindError instanceof Error ? bindError.message : "手動綁定失敗。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOfficialAuthorize(platform: SocialPlatformId) {
    const popup = window.open("", "veltrix-social-oauth", getOAuthPopupFeatures());

    setPendingPlatform(platform);
    resetMessage();

    try {
      const result = await startTenantSocialOAuth({
        platformId: platform,
        tenantName: getTenantName(),
      });
      applySocialPayload(result.data.platforms, result.data.accounts);
      if (!result.data.authorizationUrl) {
        throw new Error("平台未回傳授權網址，請確認環境變數設定。");
      }

      if (popup) {
        popup.location.href = result.data.authorizationUrl;
        popup.focus();
        watchPopupClose(popup, () => setPendingPlatform(null));
      } else {
        window.location.assign(result.data.authorizationUrl);
      }
    } catch (bindError) {
      popup?.close();
      setError(bindError instanceof Error ? bindError.message : "正式授權失敗。");
      setPendingPlatform(null);
    } finally {
      if (typeof window === "undefined") {
        setPendingPlatform(null);
      }
    }
  }

  async function handleDeleteAll() {
    if (!window.confirm("確定要刪除所有已綁定社群帳號嗎？")) {
      return;
    }

    setIsDeleting(true);
    resetMessage();

    try {
      const result = await deleteAllSocialAccounts();
      applySocialPayload(result.data.platforms, result.data.accounts);
      setNotice(result.message ?? "已刪除所有社群綁定帳號。");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "刪除失敗。");
    } finally {
      setIsDeleting(false);
    }
  }

  function applySocialPayload(
    nextPlatforms: SocialPlatformBinding[],
    nextAccounts: SocialAccountBinding[]
  ) {
    setPlatforms(nextPlatforms);
    setAccounts(nextAccounts);
  }

  function resetMessage() {
    setNotice("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          社群綁定
        </h1>
        <p className="text-sm font-medium leading-7 text-muted-foreground md:text-base">
          使用官方 OAuth 正式授權社群平台；進階情境也可手動輸入 Access Token。Token 只會顯示遮罩版本。
        </p>
      </section>

      {notice ? <StatusMessage tone="success" message={notice} /> : null}
      {error ? <StatusMessage tone="danger" message={error} /> : null}

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ManualSocialBindForm
          platforms={platforms}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
        <OfficialSocialOAuthPanel
          platforms={platforms}
          pendingPlatform={pendingPlatform}
          onAuthorize={handleOfficialAuthorize}
        />
      </section>

      <SocialAccountList
        accounts={accounts}
        platforms={platforms}
        isDeleting={isDeleting}
        onDeleteAll={handleDeleteAll}
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

function getTenantName() {
  const session = getMockSession();
  return session?.tenantName || session?.userName || "目前租戶";
}
