import { SubmissionStatus } from "./api.types";

export type { SubmissionStatus };

export interface QuoteRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: SubmissionStatus;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteStatusUpdate {
  status: SubmissionStatus;
}