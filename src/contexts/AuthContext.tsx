"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/services/core/http.service";
import { handleGlobalError } from "@/services/core/interceptor";
import type { AuthUser, LoginRequest } from "@/types";
import { authService } from "@/services/auth/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  /** 👇 NOUVEAU — permet de rafraîchir l'utilisateur en local (ex: après updateProfile) */
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* Vérifie la session au boot (via /api/auth/me) */
  const refresh = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.isUnauthorized) {
        setUser(null);
      } else {
        handleGlobalError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authService.login(data);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  }, []);

  /* 👇 Exposé pour permettre la mise à jour locale du user */
  const updateUser = useCallback((u: AuthUser) => {
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refresh, setUser: updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext doit être utilisé dans <AuthProvider>");
  return ctx;
}