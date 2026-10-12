import { SERVICES_ENDPOINTS } from "@/endpoints/services.endpoints";
import type {
  Service,
  ServiceCreateInput,
  ServiceUpdateInput,
} from "@/types";
import { CrudService } from "../core/crud.service";

export const serviceService = new CrudService<
  Service,
  ServiceCreateInput,
  ServiceUpdateInput
>(SERVICES_ENDPOINTS.base, SERVICES_ENDPOINTS.adminList);