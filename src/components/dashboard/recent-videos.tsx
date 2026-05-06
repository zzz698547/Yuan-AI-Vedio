import Link from "next/link";
import { Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { recentVideos } from "@/data/mock-admin";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  已完成: "bg-emerald-50 text-success ring-emerald-100",
  已發布: "bg-emerald-50 text-success ring-emerald-100",
  生成中: "bg-blue-50 text-primary ring-blue-100",
  處理中: "bg-blue-50 text-primary ring-blue-100",
  待審核: "bg-amber-50 text-warning ring-amber-100",
  已取消: "bg-red-50 text-danger ring-red-100",
  草稿: "bg-slate-100 text-muted-foreground ring-slate-200",
};

export function RecentVideos() {
  return (
    <section className="dashboard-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          最近生成的影片
        </h2>
        <Link
          href="/tenant/videos"
          className="text-sm font-semibold text-primary hover:text-primary/80"
        >
          查看全部
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recentVideos.map((video) => (
          <div
            key={video.title}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3FF] text-primary">
              <Play aria-hidden="true" className="size-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {video.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {video.createdAt} · {video.duration}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-transparent px-2.5 py-1 text-xs font-semibold ring-1",
                statusStyles[video.status] ?? statusStyles["草稿"]
              )}
            >
              {video.status}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
