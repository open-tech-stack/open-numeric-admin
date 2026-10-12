export const QUOTES_ENDPOINTS = {
  base: "/api/quote",
  list: "/api/quote",
  detail: (id: string) => `/api/quote/${id}`,
  updateStatus: (id: string) => `/api/quote/${id}/status`,
  delete: (id: string) => `/api/quote/${id}`,
} as const;