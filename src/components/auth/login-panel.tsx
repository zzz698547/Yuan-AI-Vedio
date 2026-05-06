"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithApi } from "@/lib/auth-api";
import { saveMockSession } from "@/lib/mock-auth";
import { cn } from "@/lib/utils";
import type { MockLoginAccount } from "@/types/auth";

type LoginPanelProps = {
  account: MockLoginAccount;
};

const accentStyles = {
  blue: {
    badge: "bg-[#EAF3FF] text-primary hover:bg-[#EAF3FF]",
    icon: "bg-[#EAF3FF] text-primary",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  green: {
    badge: "bg-success/10 text-success hover:bg-success/10",
    icon: "bg-success/10 text-success",
    button: "bg-success text-white hover:bg-success/90",
  },
};

export function LoginPanel({ account }: LoginPanelProps) {
  const router = useRouter();
  const styles = accentStyles[account.accent];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedUsername = String(formData.get("username") ?? "");
    const submittedPassword = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setError("");

    try {
      const result = await loginWithApi({
        role: account.role,
        username: submittedUsername,
        password: submittedPassword,
      });

      saveMockSession(result.data);
      router.push(result.data.redirectTo);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "登入失敗，請稍後再試。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="dashboard-card dashboard-card-hover flex h-full flex-col gap-5 p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <Badge className={styles.badge}>{account.badgeLabel}</Badge>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
              {account.title}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {account.description}
            </p>
          </div>
        </div>
        <span className={cn("icon-bubble", styles.icon)}>
          {account.role === "admin" ? (
            <ShieldCheck className="size-5" />
          ) : (
            <LockKeyhole className="size-5" />
          )}
        </span>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">
            {account.accountLabel}
          </span>
          <Input
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-12 rounded-[14px] border-border bg-white"
            autoComplete="username"
            placeholder={`請輸入${account.accountLabel}`}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">密碼</span>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-[14px] border-border bg-white"
            autoComplete="current-password"
            placeholder="請輸入密碼"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn("mt-auto h-12 rounded-[14px]", styles.button)}
      >
        {isSubmitting
          ? "登入中..."
          : `登入${account.role === "admin" ? "管理員後台" : "租戶工作區"}`}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
