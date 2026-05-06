import { Badge } from "@/components/ui/badge";
import { socialAccounts } from "@/data/mock-admin";
import type { SocialAccountSummary } from "@/types/admin-dashboard";

const platformStyles: Record<string, string> = {
  Facebook: "bg-blue-50 text-blue-600",
  Instagram: "bg-pink-50 text-pink-600",
  TikTok: "bg-slate-100 text-slate-800",
  YouTube: "bg-red-50 text-red-600",
};

type SocialBindStatusProps = {
  accounts?: readonly SocialAccountSummary[];
};

export function SocialBindStatus({ accounts = socialAccounts }: SocialBindStatusProps) {
  return (
    <section className="dashboard-card">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        社群帳號綁定狀態
      </h2>

      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <div
            key={account.platform}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-2xl text-sm font-bold ${
                platformStyles[account.platform] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {account.platform.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {account.platform}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                已連接 {account.connectedCount} 個帳號
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                account.connectedCount > 0
                  ? "rounded-full border-transparent bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-emerald-100"
                  : "rounded-full border-transparent bg-slate-100 px-2.5 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-slate-200"
              }
            >
              {account.connectedCount > 0 ? "已連接" : "未綁定"}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
