import {
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarClock,
  FileVideo,
  Link2,
  UserPlus,
  UsersRound,
} from "lucide-react";

const actions = [
  { title: "新增租戶", icon: UsersRound },
  { title: "創建帳號", icon: UserPlus },
  { title: "AI 影片生成", icon: Bot },
  { title: "影片分析", icon: FileVideo },
  { title: "綁定 AI 模型", icon: BrainCircuit },
  { title: "綁定社群帳號", icon: Link2 },
  { title: "排程管理", icon: CalendarClock },
  { title: "查看報表", icon: BarChart3 },
];

export function QuickActions() {
  return (
    <section className="dashboard-card">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        快速操作
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-4 text-center transition-colors hover:bg-slate-50"
          >
            <span className="icon-bubble">
              <action.icon aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
