import { useAuthStore } from "@/core/auth/authStore";

export function useProfile() {
  return useAuthStore((state) => state.user);
}
