import { TenantShell } from "@/components/app-shell/tenant-shell";
import { MediaTaskClient } from "@/components/media-tasks/media-task-client";

export default function TenantReferenceAnalysisPage() {
  return (
    <TenantShell>
      <MediaTaskClient
        type="reference-analysis"
        title="參考影片分析"
        description="貼上 YouTube / TikTok / Instagram / Facebook 影片網址，系統會建立真實媒體分析任務並回傳拆解結果。"
        inputLabel="影片網址"
        inputPlaceholder="貼上影片網址"
        actionLabel="開始分析"
        iconName="play"
      />
    </TenantShell>
  );
}
