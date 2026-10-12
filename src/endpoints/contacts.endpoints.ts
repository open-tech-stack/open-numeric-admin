export const CONTACTS_ENDPOINTS = {
  base: "/api/contact",
  list: "/api/contact",
  detail: (id: string) => `/api/contact/${id}`,
  updateStatus: (id: string) => `/api/contact/${id}/status`,
  delete: (id: string) => `/api/contact/${id}`,
} as const;