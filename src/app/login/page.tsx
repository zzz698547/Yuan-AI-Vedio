import Image from "next/image";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { LoginPanel } from "@/components/auth/login-panel";
import { mockLoginAccounts } from "@/data/mock-auth";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-4 py-5 text-foreground md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(47,128,237,0.16),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(180deg,#ffffff_0%,#F8FAFC_58%,#F7F9FC_100%)]" />
      <div className="pointer-events-none absolute left-8 top-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-12 h-52 w-52 rounded-full bg-warning/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-7xl flex-col">
        <header className="flex justify-center pt-12 md:pt-16">
          <Image
            src="/brand-logo.png"
            alt="Veltrix AI 品牌 Logo"
            width={520}
            height={188}
            priority
            className="h-40 w-[42rem] max-w-[88vw] object-contain md:h-48 md:w-[50rem]"
          />
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:py-7">
          <section className="mx-auto max-w-4xl space-y-5 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-[#EAF3FF] px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="size-4" />
                Veltrix AI 後台入口
              </div>
              <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-[-0.06em] text-slate-950 drop-shadow-[0_18px_28px_rgba(15,23,42,0.18)] [text-shadow:0_1px_0_rgba(255,255,255,0.95),0_3px_0_rgba(148,163,184,0.85),0_6px_0_rgba(71,85,105,0.22),0_16px_24px_rgba(15,23,42,0.20)] md:text-5xl">
                登入 AI 短影音營運中樞
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                從同一個入口進入超級管理員後台或租戶工作區，管理 AI
                影片生成、社群排程、模型設定與營運成效。
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
              {["租戶管理", "AI 影片生成", "社群排程"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[18px] border border-border bg-white/80 px-4 py-3 text-sm font-semibold text-foreground shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
                >
                  {item}
                  <CheckCircle2 className="size-4 text-success" />
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl space-y-4">
            <div className="dashboard-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">
                    安全登入
                  </p>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                    選擇登入身分
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    管理員帳密與新增租戶帳密會透過本機 API 驗證。
                  </p>
                </div>
                <span className="icon-bubble bg-[#EAF3FF] text-primary">
                  <ShieldCheck className="size-5" />
                </span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {mockLoginAccounts.map((account) => (
                <LoginPanel key={account.role} account={account} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
