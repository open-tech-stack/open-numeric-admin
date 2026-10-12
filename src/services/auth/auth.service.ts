import { AUTH_ENDPOINTS } from "@/endpoints/auth.endpoints";
import type {
  AuthUser,
  ChangePasswordInput,
  LoginRequest,
  LoginResponse,
  UpdateProfileInput,
} from "@/types";
import { httpClient } from "../core/http.service";

export const authService = {
  login: (data: LoginRequest) =>
    httpClient.post<LoginResponse>(AUTH_ENDPOINTS.login, data),

  logout: () =>
    httpClient.post<{ success: true }>(AUTH_ENDPOINTS.logout),

  me: () =>
    httpClient.get<AuthUser>(AUTH_ENDPOINTS.me),

  refresh: () =>
    httpClient.post<{ user: AuthUser }>(AUTH_ENDPOINTS.refresh),

  updateProfile: (data: UpdateProfileInput) =>
    httpClient.patch<AuthUser>(AUTH_ENDPOINTS.updateProfile, data),

  changePassword: (data: ChangePasswordInput) =>
    httpClient.patch<{ success: true }>(AUTH_ENDPOINTS.changePassword, data),
};