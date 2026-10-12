"use client";

import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Hook principal d'authentification.
 *
 * Usage :
 *   const { user, loading, login, logout } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Hook à utiliser dans les pages protégées.
 * Redirige vers /auth si non connecté (après chargement).
 *
 * ⚠️ Ne pas utiliser dans les Server Components.
 */
export function useAuthGuard() {
  const { user, loading } = useAuthContext();

  // La redirection est gérée par le layout dashboard via <RequireAuth />
  return { user, loading };
}