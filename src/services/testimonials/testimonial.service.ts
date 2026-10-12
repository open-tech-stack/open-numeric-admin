import { TESTIMONIALS_ENDPOINTS } from "@/endpoints/testimonials.endpoints";
import type {
  Testimonial,
  TestimonialCreateInput,
  TestimonialUpdateInput,
} from "@/types";
import { CrudService } from "../core/crud.service";

export const testimonialService = new CrudService<
  Testimonial,
  TestimonialCreateInput,
  TestimonialUpdateInput
>(TESTIMONIALS_ENDPOINTS.base, TESTIMONIALS_ENDPOINTS.adminList);