"use client";

import { DatabaseZap } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { invalidateApiCache } from "@/lib/api-cache";

export function AdminInitializeButton() {
  const router = useRouter();

  async function handleInitialize() {
    if (!window.confirm("確定要清空並初始化全站資料嗎？此操作會刪除租戶、社群綁定、排程與 AI 任務。")) {
      return;
    }

    await fetch("/api/bootstrap", {
      method: "POST",
    });
    invalidateApiCache();
    router.refresh();
    window.location.reload();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleInitialize}
      className="h-11 rounded-[14px] border-primary/20 bg-white text-primary hover:bg-[#EAF3FF]"
    >
      <DatabaseZap data-icon="inline-start" />
      初始化並清空資料
    </Button>
  );
}
