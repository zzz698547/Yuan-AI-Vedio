import { NextRequest, NextResponse } from "next/server";

import {
  bindAiProvider,
  unbindAiProvider,
} from "@/lib/ai-model-bindings";
import { isAiProviderId } from "@/lib/integration-service";
import { getIntegrationState } from "@/lib/server-store";

type BindProviderRequest = {
  providerId?: unknown;
  apiKey?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BindProviderRequest;

    if (!isAiProviderId(body.providerId)) {
      return NextResponse.json({ error: "AI Provider 不正確。" }, { status: 400 });
    }

    const data = bindAiProvider(getIntegrationState(), {
      providerId: body.providerId,
      apiKey: body.apiKey ?? "",
    });

    return NextResponse.json({ data, message: "API Key 已儲存。" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI Provider 綁定失敗。" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as BindProviderRequest;

    if (!isAiProviderId(body.providerId)) {
      return NextResponse.json({ error: "AI Provider 不正確。" }, { status: 400 });
    }

    const data = unbindAiProvider(getIntegrationState(), body.providerId);

    return NextResponse.json({ data, message: "AI Provider 已解除綁定。" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "解除綁定失敗。" },
      { status: 400 }
    );
  }
}
