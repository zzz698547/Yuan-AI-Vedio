import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SocialContentInsight,
  SocialPlatformAnalytics,
} from "@/types/social-operations";

type AnalyticsTablesProps = {
  platforms: SocialPlatformAnalytics[];
  insights: SocialContentInsight[];
};

export function AnalyticsTables({ platforms, insights }: AnalyticsTablesProps) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <article className="dashboard-card xl:col-span-7">
        <h2 className="text-lg font-bold text-foreground">平台健康度</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>平台</TableHead>
                <TableHead>綁定帳號</TableHead>
                <TableHead>已排程</TableHead>
                <TableHead>已發布</TableHead>
                <TableHead>失敗</TableHead>
                <TableHead>狀態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platforms.map((platform) => (
                <TableRow key={platform.platform}>
                  <TableCell className="font-bold text-foreground">
                    {platform.platformName}
                  </TableCell>
                  <TableCell>{platform.connectedAccounts}</TableCell>
                  <TableCell>{platform.scheduledCount}</TableCell>
                  <TableCell>{platform.publishedCount}</TableCell>
                  <TableCell>{platform.failedCount}</TableCell>
                  <TableCell>
                    <Badge variant={getHealthVariant(platform.health)}>
                      {platform.health}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </article>

      <article className="dashboard-card xl:col-span-5">
        <h2 className="text-lg font-bold text-foreground">內容訊號</h2>
        <div className="mt-5 grid gap-3">
          {insights.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-6 text-center">
              <p className="font-semibold text-foreground">尚無內容資料</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                建立排程或發布內容後，這裡會顯示可追蹤的內容訊號。
              </p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-2xl border border-border bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{insight.platformName}</Badge>
                  <Badge variant={getStatusVariant(insight.status)}>
                    {insight.status}
                  </Badge>
                </div>
                <h3 className="mt-3 break-words font-bold text-foreground">
                  {insight.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {insight.signal}
                </p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}

function getHealthVariant(health: SocialPlatformAnalytics["health"]) {
  if (health === "良好") {
    return "success";
  }

  if (health === "需處理") {
    return "danger";
  }

  return "warning";
}

function getStatusVariant(status: SocialContentInsight["status"]) {
  if (status === "已發布") {
    return "success";
  }

  if (status === "失敗") {
    return "danger";
  }

  if (status === "草稿") {
    return "warning";
  }

  return "info";
}
