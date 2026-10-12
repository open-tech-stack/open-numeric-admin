"use client";

import { ApiError } from "./http.service";

export function handleGlobalError(err: unknown): void {
  if (err instanceof ApiError && err.isUnauthorized) {
    // Ne pas boucler si on est déjà sur /auth
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth";
    }
  }
}