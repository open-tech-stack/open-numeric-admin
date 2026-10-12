export interface PageParams {
  page?: number;
  limit?: number;
}

export function buildPaginationQuery(params: PageParams = {}): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}