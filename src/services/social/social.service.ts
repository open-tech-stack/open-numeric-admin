import { SOCIALS_ENDPOINTS } from "@/endpoints/socials.endpoints";
import type { Social, SocialCreateInput, SocialUpdateInput } from "@/types";
import { CrudService } from "../core/crud.service";

export const socialService = new CrudService<
  Social,
  SocialCreateInput,
  SocialUpdateInput
>(SOCIALS_ENDPOINTS.base, SOCIALS_ENDPOINTS.adminList);