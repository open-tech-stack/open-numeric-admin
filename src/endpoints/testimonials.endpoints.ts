export const TESTIMONIALS_ENDPOINTS = {
  base: "/api/testimonials",
  list: "/api/testimonials",
  adminList: "/api/testimonials/admin/all",
  detail: (id: string) => `/api/testimonials/admin/${id}`,
  create: "/api/testimonials",
  update: (id: string) => `/api/testimonials/${id}`,
  delete: (id: string) => `/api/testimonials/${id}`,
} as const;