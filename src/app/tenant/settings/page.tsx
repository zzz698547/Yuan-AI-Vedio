import { Settings } from "lucide-react";

import { TenantShell } from "@/components/app-shell/tenant-shell";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function TenantSettingsPage() {
  return (
    <TenantShell>
      <EmptyState
        icon={Settings}
        title="API 模型設定"
        description="這裡將管理租戶自己的模型偏好、API Key、品牌語氣與自動生成限制。目前先以 placeholder 呈現，方便後續接表單。"
        actionLabel="準備模型設定"
      />
    </TenantShell>
  );
}
