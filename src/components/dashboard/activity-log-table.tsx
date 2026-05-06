import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activityLogs } from "@/data/mock-admin";
import type { ActivityLogItem } from "@/types/admin-dashboard";

type ActivityLogTableProps = {
  logs?: readonly ActivityLogItem[];
};

export function ActivityLogTable({ logs = activityLogs }: ActivityLogTableProps) {
  return (
    <section className="dashboard-card">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        系統活動日誌
      </h2>

      <div className="overflow-hidden rounded-2xl border border-border">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>時間</TableHead>
              <TableHead>操作人員</TableHead>
              <TableHead>操作內容</TableHead>
              <TableHead>對象</TableHead>
              <TableHead>狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  目前沒有系統活動紀錄
                </TableCell>
              </TableRow>
            ) : null}
            {logs.map((log) => (
              <TableRow key={`${log.time}-${log.target}`}>
                <TableCell className="text-muted-foreground">{log.time}</TableCell>
                <TableCell className="font-semibold text-foreground">
                  {log.actor}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="text-muted-foreground">
                  {log.target}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="rounded-full border-transparent bg-blue-50 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-blue-100"
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
