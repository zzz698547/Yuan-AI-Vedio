import { parseApiResponse } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type { AuthRole, AuthenticatedAccount } from "@/types/auth";

type LoginPayload = {
  role: AuthRole;
  username: string;
  password: string;
};

export async function loginWithApi(payload: LoginPayload) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<AuthenticatedAccount>(response) as Promise<
    ApiResponse<AuthenticatedAccount>
  >;
}
