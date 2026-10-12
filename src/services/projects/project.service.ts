import { PROJECTS_ENDPOINTS } from "@/endpoints/projects.endpoints";
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/types";
import { CrudService } from "../core/crud.service";

export const projectService = new CrudService<
  Project,
  ProjectCreateInput,
  ProjectUpdateInput
>(PROJECTS_ENDPOINTS.base, PROJECTS_ENDPOINTS.adminList);