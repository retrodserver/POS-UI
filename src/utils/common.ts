/**
 * Strip `undefined`, `null`, and empty-string values before GET/POST params.
 */
export function cleanParams<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    out[key as keyof T] = value as T[keyof T];
  }
  return out;
}

export function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return cleanParams(obj);
}
