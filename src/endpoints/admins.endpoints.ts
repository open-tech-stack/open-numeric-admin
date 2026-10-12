export const ADMINS_ENDPOINTS = {
  base: "/api/admins",
  list: "/api/admins",
  detail: (id: string) => `/api/admins/${id}`,
  create: "/api/admins",
  update: (id: string) => `/api/admins/${id}`,
  delete: (id: string) => `/api/admins/${id}`,
} as const;