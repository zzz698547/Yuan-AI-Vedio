import { NextResponse } from "next/server";

import { getAiModelPayload } from "@/lib/ai-model-bindings";
import { getIntegrationState, loadAppStore } from "@/lib/server-store";

export async function GET() {
  await loadAppStore();
  const integrations = getIntegrationState();

  return NextResponse.json({
    data: getAiModelPayload(integrations),
  });
}
