import { BarChart3 } from "lucide-react";

import { TenantShell } from "@/components/app-shell/tenant-shell";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function TenantAnalyticsPage() {
  return (
    <TenantShell>
      <EmptyState
        icon={BarChart3}
        title="成效分析"
        description="這裡將顯示各社群平台的觀看、互動、轉換與內容表現趨勢。目前先放置 placeholder，之後可接社群 analytics API。"
        actionLabel="準備分析報表"
      />
    </TenantShell>
  );
}
