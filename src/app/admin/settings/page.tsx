import { Settings } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminSettingsPage() {
  return (
    <EmptyState
      icon={Settings}
      title="系統設定"
      description="這裡將管理平台層級設定、通知規則、權限策略與預設自動化參數。目前保留乾淨 placeholder，方便下一階段接設定表單。"
      actionLabel="準備設定頁"
    />
  );
}
