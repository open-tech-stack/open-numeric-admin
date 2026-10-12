export const CLIENTS_ENDPOINTS = {
  base: "/api/clients",
  list: "/api/clients",
  adminList: "/api/clients/admin/all",
  detail: (id: string) => `/api/clients/admin/${id}`,
  create: "/api/clients",
  update: (id: string) => `/api/clients/${id}`,
  delete: (id: string) => `/api/clients/${id}`,
} as const;