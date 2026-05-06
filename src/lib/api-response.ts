import type { ApiErrorResponse, ApiResponse } from "@/types/api";

export async function parseApiResponse<T>(response: Response) {
  const payload = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

  if (!response.ok || "error" in payload) {
    throw new Error("error" in payload ? payload.error : "API 操作失敗。");
  }

  return payload;
}
