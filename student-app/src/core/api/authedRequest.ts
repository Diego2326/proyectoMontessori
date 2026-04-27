import { useAuthStore } from "@/core/auth/authStore";
import { ApiError } from "./error";
import { apiRequest } from "./client";
import { isDemoToken, mockAuthedRequest } from "./mockDemo";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Options {
  method?: Method;
  body?: unknown;
  timeoutMs?: number;
}

export async function authedRequest<T>(path: string, options: Options = {}) {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new ApiError("Debes iniciar sesión para continuar.", 401);
  }
  if (isDemoToken(token)) {
    return mockAuthedRequest<T>(path, options);
  }
  return apiRequest<T>(path, { ...options, token });
}
