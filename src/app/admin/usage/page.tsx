import { Activity } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminUsagePage() {
  return (
    <EmptyState
      icon={Activity}
      title="使用狀況"
      description="這裡將呈現跨租戶影片生成量、API 成本、模型錯誤率與額度趨勢。目前先以 loading skeleton placeholder 保留資訊架構。"
      actionLabel="準備用量報表"
    />
  );
}
