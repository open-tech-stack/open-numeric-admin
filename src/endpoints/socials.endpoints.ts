export const SOCIALS_ENDPOINTS = {
  base: "/api/socials",
  list: "/api/socials",
  adminList: "/api/socials/admin/all",
  detail: (id: string) => `/api/socials/admin/${id}`,
  create: "/api/socials",
  update: (id: string) => `/api/socials/${id}`,
  delete: (id: string) => `/api/socials/${id}`,
} as const;