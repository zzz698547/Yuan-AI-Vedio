"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TenantRecord, TenantStatus } from "@/types/tenant-management";

const statusStyles: Record<TenantStatus, string> = {
  啟用中: "bg-emerald-50 text-success ring-emerald-100",
  即將到期: "bg-amber-50 text-warning ring-amber-100",
  已停權: "bg-red-50 text-danger ring-red-100",
};

type TenantListTableProps = {
  tenants: TenantRecord[];
  totalCount: number;
  onView: (tenant: TenantRecord) => void;
  onEdit: (tenant: TenantRecord) => void;
  onToggleSuspension: (tenant: TenantRecord) => void;
  onExtend: (tenant: TenantRecord) => void;
  onDelete: (tenant: TenantRecord) => void;
  onDeleteAll: () => void;
};

export function TenantListTable({
  tenants,
  totalCount,
  onView,
  onEdit,
  onToggleSuspension,
  onExtend,
  onDelete,
  onDeleteAll,
}: TenantListTableProps) {
  return (
    <section className="dashboard-card overflow-hidden">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            租戶列表
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            目前顯示 {tenants.length} / {totalCount} 筆租戶
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-fit rounded-[14px]"
          disabled={totalCount === 0}
          onClick={onDeleteAll}
        >
          <Trash2 data-icon="inline-start" />
          全部刪除
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>租戶名稱</TableHead>
              <TableHead>聯絡人</TableHead>
              <TableHead>帳號 / 暱稱</TableHead>
              <TableHead>方案</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>到期日</TableHead>
              <TableHead>影片生成量</TableHead>
              <TableHead>API 使用量</TableHead>
              <TableHead>社群綁定數</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-semibold text-foreground">
                  {tenant.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {tenant.contact}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{tenant.username}</p>
                    <p className="text-xs text-muted-foreground">{tenant.nickname}</p>
                  </div>
                </TableCell>
                <TableCell>{tenant.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                      statusStyles[tenant.status]
                    )}
                  >
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.expiredAt}</TableCell>
                <TableCell>{tenant.videos.toLocaleString()}</TableCell>
                <TableCell>{tenant.apiUsage}%</TableCell>
                <TableCell>{tenant.socialAccounts}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(tenant)}>
                      <Eye data-icon="inline-start" />
                      查看
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(tenant)}>
                      <Pencil data-icon="inline-start" />
                      編輯
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onToggleSuspension(tenant)}
                    >
                      {tenant.status === "已停權" ? "啟用" : "停權"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onExtend(tenant)}>
                      延長到期日
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(tenant)}>
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    目前沒有符合條件的租戶
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    可調整搜尋條件，或點擊新增租戶建立 mock 資料。
                  </p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
