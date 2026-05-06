import { NextRequest, NextResponse } from "next/server";

import { updateModelFeature } from "@/lib/ai-model-bindings";
import { getIntegrationState, loadAppStore, saveAppStore } from "@/lib/server-store";
import type { ModelFeatureBinding } from "@/types/integrations";

type FeatureRequest = Partial<ModelFeatureBinding>;

const featureStatuses: ModelFeatureBinding["status"][] = [
  "啟用中",
  "測試中",
  "待設定",
];

export async function PATCH(request: NextRequest) {
  try {
    await loadAppStore();
    const body = (await request.json()) as FeatureRequest;

    if (!body.feature || !featureStatuses.includes(body.status ?? "待設定")) {
      return NextResponse.json({ error: "模型用途資料不正確。" }, { status: 400 });
    }

    const data = updateModelFeature(getIntegrationState(), {
      feature: body.feature,
      currentModel: body.currentModel ?? "",
      fallbackModel: body.fallbackModel ?? "",
      estimatedCost: body.estimatedCost ?? "",
      status: body.status ?? "待設定",
    });

    await saveAppStore();
    return NextResponse.json({ data, message: "模型用途設定已更新。" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "模型用途更新失敗。" },
      { status: 400 }
    );
  }
}
