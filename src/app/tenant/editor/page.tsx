import { TenantShell } from "@/components/app-shell/tenant-shell";
import { MediaTaskClient } from "@/components/media-tasks/media-task-client";

export default function TenantEditorPage() {
  return (
    <TenantShell>
      <MediaTaskClient
        type="video-editing"
        title="AI 影片剪輯器"
        description="輸入素材連結或素材 ID，系統會建立剪輯任務，執行去除空白、自動字幕、9:16 轉換與 CTA 片尾流程。"
        inputLabel="素材連結或素材 ID"
        inputPlaceholder="例如 asset-001 或 https://..."
        actionLabel="執行剪輯任務"
        iconName="clapperboard"
      />
    </TenantShell>
  );
}
