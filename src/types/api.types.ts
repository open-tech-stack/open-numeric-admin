export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SubmissionStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED" | "SPAM";