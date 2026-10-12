import { TEAM_ENDPOINTS } from "@/endpoints/team.endpoints";
import type {
  TeamMember,
  TeamMemberCreateInput,
  TeamMemberUpdateInput,
} from "@/types";
import { CrudService } from "../core/crud.service";

export const teamService = new CrudService<
  TeamMember,
  TeamMemberCreateInput,
  TeamMemberUpdateInput
>(TEAM_ENDPOINTS.base, TEAM_ENDPOINTS.adminList);