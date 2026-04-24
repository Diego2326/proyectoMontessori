import { env } from "@/core/config/env";
import { ApiError, parseApiErrorPayload } from "./error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

function normalizePath(path: string) {
  if (path.startsWith("http")) return path;
  if (!env.apiBaseUrl) {
    throw new ApiError(
      "Falta configurar EXPO_PUBLIC_API_BASE_URL. Revisa tu archivo .env y reinicia Expo.",
      500
    );
  }
  return `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function toFriendlyMessage(status: number, payload?: { error?: string; message?: string }) {
  if (payload?.error) return payload.error;
  if (payload?.message) return payload.message;
  if (status === 401) return "Tu sesión expiró. Inicia sesión de nuevo.";
  if (status === 403) return "No tienes acceso a este recurso.";
  if (status === 404) return "No encontramos la información solicitada.";
  if (status >= 500) return "El servidor no está disponible temporalmente.";
  return "No se pudo completar la operación.";
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, timeoutMs = 12000, headers = {} } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(normalizePath(path), {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const payload = parseApiErrorPayload(parsed);
      const message = toFriendlyMessage(response.status, payload);
      const error = new ApiError(message, response.status, payload);

      if (response.status === 401 && unauthorizedHandler) {
        unauthorizedHandler();
      }

      throw error;
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof SyntaxError) {
      throw new ApiError("Respuesta inválida del servidor.", 500);
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Tiempo de espera agotado. Reintenta.", 408);
    }
    throw new ApiError("Sin conexión o error de red.", 0);
  } finally {
    clearTimeout(timeout);
  }
}
