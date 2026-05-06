import { CheckCircle2, Link2, ShieldCheck, TriangleAlert } from "lucide-react";

import type {
  SocialAccountBinding,
  SocialPlatformBinding,
} from "@/types/integrations";

type SocialBindingOverviewProps = {
  accounts: SocialAccountBinding[];
  platforms: SocialPlatformBinding[];
};

const overviewItems = [
  {
    key: "accounts",
    label: "已綁定帳號",
    tone: "bg-blue-50 text-primary ring-blue-100",
    icon: Link2,
  },
  {
    key: "verified",
    label: "已驗證平台",
    tone: "bg-emerald-50 text-success ring-emerald-100",
    icon: CheckCircle2,
  },
  {
    key: "permissions",
    label: "可發布帳號",
    tone: "bg-violet-50 text-violet-600 ring-violet-100",
    icon: ShieldCheck,
  },
  {
    key: "issues",
    label: "需處理項目",
    tone: "bg-amber-50 text-warning ring-amber-100",
    icon: TriangleAlert,
  },
] as const;

export function SocialBindingOverview({
  accounts,
  platforms,
}: SocialBindingOverviewProps) {
  const values = {
    accounts: accounts.length,
    verified: platforms.filter((platform) => platform.status === "已驗證").length,
    permissions: accounts.filter(
      (account) =>
        account.permissionStatus === "可發文" ||
        account.permissionStatus === "可上傳"
    ).length,
    issues:
      platforms.filter(
        (platform) =>
          platform.status === "缺少環境變數" || platform.status === "驗證失敗"
      ).length +
      accounts.filter((account) => account.tokenStatus !== "正常").length,
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {overviewItems.map((item) => {
        const Icon = item.icon;

        return (
          <article key={item.key} className="dashboard-card dashboard-card-hover">
            <span
              className={`inline-flex size-10 items-center justify-center rounded-2xl ring-1 ${item.tone}`}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-4 metric-label">{item.label}</p>
            <p className="mt-1 metric-value text-[28px]">{values[item.key]}</p>
          </article>
        );
      })}
    </section>
  );
}
