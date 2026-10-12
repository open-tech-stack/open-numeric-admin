import { CLIENTS_ENDPOINTS } from "@/endpoints/clients.endpoints";
import type { Client, ClientCreateInput, ClientUpdateInput } from "@/types";
import { CrudService } from "../core/crud.service";

export const clientService = new CrudService<
  Client,
  ClientCreateInput,
  ClientUpdateInput
>(CLIENTS_ENDPOINTS.base, CLIENTS_ENDPOINTS.adminList);