import { SubmissionStatus } from "./api.types";


export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStatusUpdate {
  status: SubmissionStatus;
}