import type { AdminRole } from "./admin.types";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  role: AdminRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

/* ============================================================
   Profile
   ============================================================ */

export interface UpdateProfileInput {
  displayName?: string;
  email?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}