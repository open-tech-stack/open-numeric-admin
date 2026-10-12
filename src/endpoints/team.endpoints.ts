export const TEAM_ENDPOINTS = {
  base: "/api/team",
  list: "/api/team",
  adminList: "/api/team/admin/all",
  detail: (id: string) => `/api/team/admin/${id}`,
  create: "/api/team",
  update: (id: string) => `/api/team/${id}`,
  delete: (id: string) => `/api/team/${id}`,
} as const;