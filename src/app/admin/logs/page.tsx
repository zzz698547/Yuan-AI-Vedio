import { ScrollText } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminLogsPage() {
  return (
    <EmptyState
      icon={ScrollText}
      title="操作日誌"
      description="這裡將集中顯示系統事件、租戶操作、AI 任務與社群發布紀錄。目前先以 placeholder 呈現，之後可接上 audit log API。"
      actionLabel="準備日誌模組"
    />
  );
}
