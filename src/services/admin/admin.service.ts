import { ADMINS_ENDPOINTS } from "@/endpoints/admins.endpoints";
import { CrudService } from "../core/crud.service";
import { Admin, AdminCreateInput, AdminUpdateInput } from "@/types";

/**
 * Service Administrateurs.
 *
 * ⚠️ Le backend expose `GET /api/admins` (liste complète, ADMIN only).
 * Il n'y a pas de route publique `/api/admins`.
 * On passe donc le même path pour `base` et `adminPath`.
 */
export const adminService = new CrudService<
  Admin,
  AdminCreateInput,
  AdminUpdateInput
>(ADMINS_ENDPOINTS.base, ADMINS_ENDPOINTS.list);