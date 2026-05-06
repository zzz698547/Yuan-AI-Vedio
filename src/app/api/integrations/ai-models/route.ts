import { NextResponse } from "next/server";

import { getAiModelPayload } from "@/lib/ai-model-bindings";
import { getIntegrationState } from "@/lib/server-store";

export async function GET() {
  const integrations = getIntegrationState();

  return NextResponse.json({
    data: getAiModelPayload(integrations),
  });
}
