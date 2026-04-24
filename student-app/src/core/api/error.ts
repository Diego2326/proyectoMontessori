import { ApiErrorPayload } from "@/types/api";

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function parseApiErrorPayload(payload: unknown): ApiErrorPayload | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  return payload as ApiErrorPayload;
}

export function getErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
