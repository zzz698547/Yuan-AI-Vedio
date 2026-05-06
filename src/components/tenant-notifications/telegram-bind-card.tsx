"use client";

import type { FormEvent } from "react";
import { Send, TestTube2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TelegramBinding } from "@/types/notification";

type TelegramBindCardProps = {
  telegram: TelegramBinding;
  isBinding: boolean;
  isTesting: boolean;
  onBind: (event: FormEvent<HTMLFormElement>) => void;
  onTest: () => void;
};

export function TelegramBindCard({
  telegram,
  isBinding,
  isTesting,
  onBind,
  onTest,
}: TelegramBindCardProps) {
  return (
    <section className="dashboard-card flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Telegram 手動綁定</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          輸入 Bot Token 與 Chat ID，系統會透過 Telegram Bot API 發送通知。
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-slate-50 p-4">
        <p className="text-sm font-semibold text-foreground">
          狀態：{telegram.enabled ? "已綁定" : "尚未綁定"}
        </p>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          Bot：{telegram.botTokenMasked}
        </p>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          Chat：{telegram.chatIdMasked}
        </p>
        {telegram.lastMessage ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {telegram.lastMessage}
          </p>
        ) : null}
      </div>

      <form onSubmit={onBind} className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">Bot Token</span>
          <Input
            name="botToken"
            type="password"
            placeholder="例如：123456:ABC-DEF..."
            className="h-11 rounded-[14px]"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-foreground">Chat ID</span>
          <Input
            name="chatId"
            placeholder="例如：-1001234567890 或個人 chat id"
            className="h-11 rounded-[14px]"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="submit" disabled={isBinding} className="h-11 rounded-xl">
            <Send data-icon="inline-start" />
            {isBinding ? "綁定中..." : "儲存綁定"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!telegram.enabled || isTesting}
            onClick={onTest}
            className="h-11 rounded-xl"
          >
            <TestTube2 data-icon="inline-start" />
            {isTesting ? "送出中..." : "測試通知"}
          </Button>
        </div>
      </form>
    </section>
  );
}
