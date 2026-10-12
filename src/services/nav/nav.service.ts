// services/nav/nav.service.ts
import { NAV_ENDPOINTS } from "@/endpoints/nav.endpoints";
import { httpClient } from "../core/http.service";
import { CrudService } from "../core/crud.service";
import type {
  CreateNavItemInput,
  NavItem,
  ReorderNavInput,
  UpdateNavItemInput,
} from "@/types";

class NavCrudService extends CrudService<
  NavItem,
  CreateNavItemInput,
  UpdateNavItemInput
> {
  constructor() {
    super(NAV_ENDPOINTS.base, NAV_ENDPOINTS.adminAll);
  }

  getTree(): Promise<NavItem[]> {
    return httpClient.get<NavItem[]>(NAV_ENDPOINTS.base);
  }

  reorder(input: ReorderNavInput): Promise<NavItem[]> {
    return httpClient.patch<NavItem[]>(NAV_ENDPOINTS.reorder, input);
  }
}

export const navService = new NavCrudService();