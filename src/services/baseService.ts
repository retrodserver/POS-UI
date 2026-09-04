import { cleanParams } from "@/utils/common";

/** Optional generic helpers for domain services. */
export function buildQueryString(params: Record<string, unknown>): string {
  const cleaned = cleanParams(params);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(cleaned)) {
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
