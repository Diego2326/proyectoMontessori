import { create } from "zustand";
import { readSession, readUserCache, saveSession, clearSession, saveUserCache, clearUserCache } from "./secureSession";
import { SessionSnapshot } from "@/types/api";
import { UserDto } from "@/types/dto";

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  user: UserDto | null;
  isRestoring: boolean;
  unauthorizedReason: string | null;
  setAuthenticatedSession: (payload: SessionSnapshot & { user: UserDto }) => Promise<void>;
  setUser: (user: UserDto) => Promise<void>;
  logout: (reason?: string) => Promise<void>;
  restoreLocalSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  expiresAt: null,
  user: null,
  isRestoring: true,
  unauthorizedReason: null,

  setAuthenticatedSession: async ({ token, expiresAt, user }) => {
    await saveSession({ token, expiresAt });
    await saveUserCache(user);
    set({ token, expiresAt, user, unauthorizedReason: null });
  },

  setUser: async (user) => {
    await saveUserCache(user);
    set({ user });
  },

  logout: async (reason) => {
    await clearSession();
    await clearUserCache();
    set({
      token: null,
      expiresAt: null,
      user: null,
      unauthorizedReason: reason ?? null,
    });
  },

  restoreLocalSession: async () => {
    set({ isRestoring: true });
    try {
      const [session, user] = await Promise.all([readSession(), readUserCache()]);
      if (!session) {
        set({ token: null, expiresAt: null, user: null, isRestoring: false });
        return;
      }
      set({
        token: session.token,
        expiresAt: session.expiresAt,
        user: user ?? null,
        isRestoring: false,
      });
    } catch {
      set({ token: null, expiresAt: null, user: null, isRestoring: false });
    }
  },
}));

export function isStudentRole(user: UserDto | null | undefined) {
  return user?.role === "STUDENT";
}
