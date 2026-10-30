import { z } from "zod";
import { listQuerySchema } from "@/features/catalog/schemas";
import { CatalogQueryError } from "./catalogCursor";
const booleanParam = z.enum(["true", "false"]).transform((v) => v === "true");
const allowed = new Set([
  "categorySlug",
  "q",
  "brandSlugs",
  "priceMin",
  "priceMax",
  "inStock",
  "discounted",
  "attributes",
  "sort",
  "cursor",
  "limit",
]);
export function parseListParams(params: URLSearchParams) {
  for (const key of params.keys())
    if (!allowed.has(key)) throw new CatalogQueryError("invalid_query");
  const raw: Record<string, unknown> = {};
  for (const key of allowed) {
    const value = params.get(key);
    if (value === null) continue;
    if (key === "brandSlugs")
      raw[key] = params
        .getAll(key)
        .flatMap((v) => v.split(","))
        .filter(Boolean);
    else if (key === "attributes") {
      try {
        raw[key] = JSON.parse(value);
      } catch {
        throw new SyntaxError("Invalid attributes");
      }
    } else if (key === "inStock" || key === "discounted")
      raw[key] = booleanParam.parse(value);
    else raw[key] = value;
  }
  return listQuerySchema.parse(raw);
}
export function catalogError(error: unknown) {
  if (
    error instanceof z.ZodError ||
    error instanceof SyntaxError ||
    error instanceof CatalogQueryError
  )
    return Response.json(
      { ok: false, error: { code: "INVALID_QUERY" } },
      { status: 400 },
    );
  return Response.json(
    { ok: false, error: { code: "CATALOG_UNAVAILABLE" } },
    { status: 503 },
  );
}
