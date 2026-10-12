export const PROJECTS_ENDPOINTS = {
  base: "/api/projects",
  list: "/api/projects",
  adminList: "/api/projects/admin/all",
  detail: (id: string) => `/api/projects/admin/${id}`,
  create: "/api/projects",
  update: (id: string) => `/api/projects/${id}`,
  delete: (id: string) => `/api/projects/${id}`,
} as const;