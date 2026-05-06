"use client";

import { Button } from "@/components/ui/button";
import type { TenantRecord } from "@/types/tenant-management";

type TenantDetailModalProps = {
  tenant: TenantRecord | null;
  onClose: () => void;
};

export function TenantDetailModal({ tenant, onClose }: TenantDetailModalProps) {
  if (!tenant) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 p-4 backdrop-blur-sm">
      <div className="dashboard-card w-full max-w-lg">
        <h2 className="text-xl font-bold text-foreground">{tenant.name}</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <p>聯絡人：{tenant.contact}</p>
          <p>租戶帳號：{tenant.username}</p>
          <p>租戶暱稱：{tenant.nickname}</p>
          <p>租戶密碼：••••••••</p>
          <p>方案：{tenant.plan}</p>
          <p>狀態：{tenant.status}</p>
          <p>到期日：{tenant.expiredAt}</p>
          <p>影片生成量：{tenant.videos.toLocaleString()}</p>
          <p>API 使用量：{tenant.apiUsage}%</p>
          <p>社群綁定數：{tenant.socialAccounts}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>關閉</Button>
        </div>
      </div>
    </div>
  );
}
