import { TenantShell } from "@/components/app-shell/tenant-shell";
import { MediaTaskClient } from "@/components/media-tasks/media-task-client";

export default function TenantVideosPage() {
  return (
    <TenantShell>
      <MediaTaskClient
        type="video-generation"
        title="我的影片"
        description="建立 AI 影片生成任務，產出後會進入影片專案列表。這裡先接任務 API，後續可替換成佇列與物件儲存。"
        inputLabel="影片主題或生成需求"
        inputPlaceholder="例如：30 秒 AI 工具短影音"
        actionLabel="建立影片生成任務"
        iconName="file-video"
      />
    </TenantShell>
  );
}
