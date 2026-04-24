import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/core/api/client";
import { authedRequest } from "@/core/api/authedRequest";
import {
  LoginRequest,
  LoginResponse,
  PrecheckRequest,
  PrecheckResponse,
  SetPasswordRequest,
  UserDto,
} from "@/types/dto";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function login(payload: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function precheck(payload: PrecheckRequest) {
  return apiRequest<PrecheckResponse>("/auth/precheck", {
    method: "POST",
    body: payload,
  });
}

export function setPassword(payload: SetPasswordRequest) {
  return apiRequest<{ message?: string }>("/auth/set-password", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return authedRequest<UserDto>("/auth/me");
}

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    enabled,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function usePrecheckMutation() {
  return useMutation({
    mutationFn: precheck,
  });
}

export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: setPassword,
  });
}
