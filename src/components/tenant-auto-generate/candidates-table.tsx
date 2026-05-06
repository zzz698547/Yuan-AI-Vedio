"use client";

import { Eye, PlayCircle, Rocket, Sparkles, TrendingUp } from "lucide-react";

import { SectionTitle } from "@/components/tenant-auto-generate/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  TenantCandidateAction,
  TenantCandidateRisk,
  TenantCandidateStatus,
  TenantCandidateVideo,
} from "@/types/tenant-automation";

type CandidatesTableProps = {
  candidates: TenantCandidateVideo[];
  isGenerating: boolean;
  isMutating: boolean;
  onGenerate: () => void;
  onAction: (candidateId: string, action: TenantCandidateAction) => void;
};

const statusStyles: Record<TenantCandidateStatus, string> = {
  草稿: "border-slate-200 bg-slate-50 text-slate-500",
  待審核: "border-blue-100 bg-[#EAF3FF] text-[var(--primary)]",
  待修改: "border-orange-100 bg-orange-50 text-[var(--warning)]",
  已排程: "border-green-100 bg-green-50 text-[var(--success)]",
  已拒絕: "border-red-100 bg-red-50 text-[var(--danger)]",
};

export function CandidatesTable({
  candidates,
  isGenerating,
  isMutating,
  onGenerate,
  onAction,
}: CandidatesTableProps) {
  return (
    <section className="dashboard-card overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-[#E5EAF3] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <SectionTitle
          icon={Sparkles}
          title="今日 AI 產生候選影片"
          description="產生、審核、退回與排程都會呼叫 API 更新狀態。"
        />
        <Button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="h-10 rounded-[14px] bg-[var(--primary)] px-4 text-white hover:bg-[#256FCE]"
        >
          <Rocket aria-hidden="true" className="size-4" />
          {isGenerating ? "產生中..." : "立即產生"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="px-5 py-4 text-xs font-semibold text-slate-500">
                標題
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold text-slate-500">
                趨勢分數
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold text-slate-500">
                品牌適配度
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold text-slate-500">
                風險等級
              </TableHead>
              <TableHead className="px-5 py-4 text-xs font-semibold text-slate-500">
                狀態
              </TableHead>
              <TableHead className="px-5 py-4 text-right text-xs font-semibold text-slate-500">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-12 text-center">
                  <p className="font-semibold text-slate-800">尚無候選影片</p>
                  <p className="mt-2 text-sm text-slate-500">
                    保存設定後按下「立即產生」，系統會透過 API 建立候選影片。
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((video) => (
                <TableRow key={video.id} className="hover:bg-[#F8FBFF]">
                  <TableCell className="min-w-[280px] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[var(--primary)]">
                        <PlayCircle aria-hidden="true" className="size-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          {video.title}
                        </span>
                        <p className="mt-1 text-xs text-slate-400">
                          {video.platform}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-[var(--primary)]" />
                      <span className="font-semibold text-slate-800">
                        {video.trendScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="min-w-28">
                      <span className="text-xs font-semibold text-slate-500">
                        {video.brandFit}%
                      </span>
                      <Progress
                        value={video.brandFit}
                        className="mt-2 gap-0 [&_[data-slot=progress-indicator]]:bg-[#22C55E] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-slate-100"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <RiskBadge risk={video.risk} />
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={cn("rounded-full", statusStyles[video.status])}
                    >
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <div className="flex min-w-max justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" className="rounded-xl">
                        <Eye className="size-3.5" />
                        查看
                      </Button>
                      <ActionButton
                        disabled={isMutating}
                        label="排程"
                        action="schedule"
                        candidateId={video.id}
                        onAction={onAction}
                      />
                      <ActionButton
                        disabled={isMutating}
                        label="退回"
                        action="revise"
                        candidateId={video.id}
                        onAction={onAction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function RiskBadge({ risk }: { risk: TenantCandidateRisk }) {
  const className =
    risk === "低"
      ? "border-green-100 bg-green-50 text-[var(--success)]"
      : risk === "中"
        ? "border-orange-100 bg-orange-50 text-[var(--warning)]"
        : "border-red-100 bg-red-50 text-[var(--danger)]";

  return (
    <Badge variant="outline" className={className}>
      {risk}風險
    </Badge>
  );
}

function ActionButton({
  candidateId,
  action,
  label,
  disabled,
  onAction,
}: {
  candidateId: string;
  action: TenantCandidateAction;
  label: string;
  disabled: boolean;
  onAction: (candidateId: string, action: TenantCandidateAction) => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      disabled={disabled}
      onClick={() => onAction(candidateId, action)}
      className="rounded-xl bg-[var(--primary)] text-white hover:bg-[#256FCE]"
    >
      {label}
    </Button>
  );
}
