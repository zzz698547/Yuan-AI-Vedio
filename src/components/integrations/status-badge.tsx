import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IntegrationStatus } from "@/types/integrations";

type StatusBadgeProps = {
  status: IntegrationStatus | "OAuth 待完成" | "正常" | "未綁定" | "待授權";
};

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  未設定: "bg-slate-100 text-slate-500 ring-slate-200",
  缺少環境變數: "bg-amber-50 text-warning ring-amber-100",
  已設定: "bg-blue-50 text-primary ring-blue-100",
  已驗證: "bg-emerald-50 text-success ring-emerald-100",
  驗證失敗: "bg-red-50 text-danger ring-red-100",
  "OAuth 待完成": "bg-violet-50 text-[#8B5CF6] ring-violet-100",
  正常: "bg-emerald-50 text-success ring-emerald-100",
  未綁定: "bg-slate-100 text-slate-500 ring-slate-200",
  待授權: "bg-amber-50 text-warning ring-amber-100",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
        statusStyles[status]
      )}
    >
      {status}
    </Badge>
  );
}
