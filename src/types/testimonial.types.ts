import type { BaseTranslation } from "./common.types";

export interface TestimonialTranslation extends BaseTranslation {
  quote: string;
  author: string;
  company: string;
}

export interface Testimonial {
  id: string;
  key: string;
  image: string;
  rating: number; // 1 à 5
  order: number;
  isActive: boolean;
  translations: TestimonialTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialCreateInput {
  key: string;
  image: string;
  rating?: number;
  order?: number;
  isActive?: boolean;
  translations: TestimonialTranslation[];
}

export type TestimonialUpdateInput = Partial<
  Omit<TestimonialCreateInput, "key">
>;