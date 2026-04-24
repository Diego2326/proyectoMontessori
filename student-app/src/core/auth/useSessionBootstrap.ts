import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/core/api/client";
import { useAuthStore } from "./authStore";
import { getMe } from "@/features/auth/api";
import { queryClient } from "@/core/query/queryClient";

export function useSessionBootstrap() {
  const restoreLocalSession = useAuthStore((s) => s.restoreLocalSession);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const appQueryClient = useQueryClient();

  useEffect(() => {
    restoreLocalSession().catch(() => undefined);
  }, [restoreLocalSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout("Tu sesión expiró. Inicia sesión nuevamente.").finally(() => {
        queryClient.clear();
      });
    });
  }, [logout]);

  useEffect(() => {
    const hydrate = async () => {
      if (!token || !expiresAt) return;
      const expiryDate = new Date(expiresAt);
      if (Number.isNaN(expiryDate.getTime()) || expiryDate.getTime() <= Date.now()) {
        await logout("Tu sesión expiró. Inicia sesión nuevamente.");
        appQueryClient.clear();
        return;
      }
      try {
        const me = await getMe();
        await setUser(me);
      } catch {
        // El handler global de 401 maneja cierre de sesión.
      }
    };

    hydrate().catch(() => undefined);
  }, [token, expiresAt, logout, setUser, appQueryClient]);
}
