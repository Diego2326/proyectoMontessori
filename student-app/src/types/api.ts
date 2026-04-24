export interface ApiErrorPayload {
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

export interface SessionSnapshot {
  token: string;
  expiresAt: string;
}
