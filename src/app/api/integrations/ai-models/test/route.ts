import { NextRequest, NextResponse } from "next/server";

import { testAiProvider } from "@/lib/ai-model-bindings";
import { isAiProviderId } from "@/lib/integration-service";
import { getIntegrationState } from "@/lib/server-store";

type TestProviderRequest = {
  providerId?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TestProviderRequest;

    if (!isAiProviderId(body.providerId)) {
      return NextResponse.json({ error: "AI Provider 不正確。" }, { status: 400 });
    }

    const integrations = getIntegrationState();
    const result = await testAiProvider(integrations, body.providerId);

    return NextResponse.json({
      data: result,
      message: result.provider?.lastMessage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI Provider 測試失敗。" },
      { status: 400 }
    );
  }
}
