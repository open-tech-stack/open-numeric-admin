export const SERVICES_ENDPOINTS = {
  base: "/api/services",
  list: "/api/services",
  adminList: "/api/services/admin/all",
  detail: (id: string) => `/api/services/admin/${id}`,
  detailBySlug: (slug: string) => `/api/services/${slug}`,
  create: "/api/services",
  update: (id: string) => `/api/services/${id}`,
  delete: (id: string) => `/api/services/${id}`,

  // Catégories
  createCategory: (serviceId: string) =>
    `/api/services/${serviceId}/categories`,
  updateCategory: (id: string) => `/api/services/categories/${id}`,
  deleteCategory: (id: string) => `/api/services/categories/${id}`,

  // Items
  createItem: (categoryId: string) =>
    `/api/services/categories/${categoryId}/items`,
  updateItem: (id: string) => `/api/services/items/${id}`,
  deleteItem: (id: string) => `/api/services/items/${id}`,
} as const;