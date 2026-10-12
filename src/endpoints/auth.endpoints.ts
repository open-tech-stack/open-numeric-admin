export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  me: "/api/auth/me",
  refresh: "/api/auth/refresh",
  updateProfile: "/api/auth/me",       // PATCH
  changePassword: "/api/auth/password",// PATCH
} as const;