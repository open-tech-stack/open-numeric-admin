// services/core/interceptor.ts
"use client";

import { ApiError } from "./http.service";

let isRedirecting = false;

export function handleGlobalError(err: unknown): void {
  if (err instanceof ApiError && err.isUnauthorized) {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/auth")) return;
    if (isRedirecting) return; 

    isRedirecting = true;
    window.location.href = "/auth";

    // reset après un délai (au cas où)
    setTimeout(() => { isRedirecting = false; }, 3000);
  }
}