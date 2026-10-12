import { httpClient } from "./http.service";
import { buildPaginationQuery, type PageParams } from "./pagination";
import type { PaginatedResponse } from "@/types";

/**
 * Service CRUD générique.
 *
 * Utilisation :
 *   const service = new CrudService<Client>("/api/clients");
 *   const list = await service.list({ page: 1, limit: 20 });
 */
export class CrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  constructor(
    private readonly basePath: string,
    private readonly adminPath?: string, // ex: "/api/clients/admin/all"
  ) {}

  /** Liste paginée (public) */
  async list(params: PageParams = {}): Promise<PaginatedResponse<T>> {
    const qs = buildPaginationQuery(params);
    return httpClient.get<PaginatedResponse<T>>(`${this.basePath}${qs}`);
  }

  /**
   * Liste complète (admin, sans pagination).
   *
   * ⚠️ Le backend peut renvoyer 2 formes selon l'entité :
   *   - un tableau brut :                     [ ... ]
   *   - un objet paginé :                     { items: [...], total, ... }
   *
   * On normalise ici pour garantir un `T[]` côté hook/composant.
   */
  async listAll(): Promise<T[]> {
    const path = this.adminPath ?? `${this.basePath}/admin/all`;

    const res = await httpClient.get<
      T[] | { items?: T[]; data?: T[]; results?: T[] }
    >(path);

    // Cas 1 : tableau brut (ex: /clients/admin/all)
    if (Array.isArray(res)) return res;

    // Cas 2 : objet enveloppé (ex: /projects/admin/all → { items: [...] })
    if (res && typeof res === "object") {
      if (Array.isArray(res.items)) return res.items;
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.results)) return res.results;
    }

    // Fallback : jamais null/undefined
    return [];
  }

  /** Détail par id */
  async getById(id: string): Promise<T> {
    return httpClient.get<T>(`${this.basePath}/admin/${id}`);
  }

  /** Créer */
  async create(data: TCreate): Promise<T> {
    return httpClient.post<T>(this.basePath, data);
  }

  /** Mettre à jour */
  async update(id: string, data: TUpdate): Promise<T> {
    return httpClient.patch<T>(`${this.basePath}/${id}`, data);
  }

  /** Supprimer */
  async delete(id: string): Promise<{ success: true }> {
    return httpClient.delete<{ success: true }>(`${this.basePath}/${id}`);
  }
}