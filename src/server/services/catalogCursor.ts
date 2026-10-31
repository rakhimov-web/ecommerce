import { createHash } from "node:crypto";
import { z } from "zod";
import type { ParsedListQuery, Product } from "@/features/catalog/types";
export class CatalogQueryError extends Error {
  constructor(public readonly code: "invalid_cursor" | "invalid_query") {
    super(code);
  }
}
const cursorSchema = z
  .object({
    v: z.literal(1),
    after: z.string().min(1),
    scope: z.string().length(64),
  })
  .strict();
function scope(query: ParsedListQuery) {
  const { cursor, limit, ...filters } = query;
  void cursor;
  void limit;
  return createHash("sha256")
    .update(
      JSON.stringify({
        ...filters,
        brandSlugs: [...filters.brandSlugs].sort(),
        attributes: Object.fromEntries(
          Object.entries(filters.attributes)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, values]) => [
              key,
              [...values].sort((a, b) => String(a).localeCompare(String(b))),
            ]),
        ),
      }),
    )
    .digest("hex");
}
export function paginate(items: Product[], query: ParsedListQuery) {
  const signature = scope(query);
  let start = 0;
  if (query.cursor) {
    try {
      if (
        !/^[A-Za-z0-9_-]+$/.test(query.cursor) ||
        Buffer.from(query.cursor, "base64url").toString("base64url") !==
          query.cursor
      )
        throw new Error();
      const decoded = cursorSchema.parse(
        JSON.parse(Buffer.from(query.cursor, "base64url").toString("utf8")),
      );
      const index = items.findIndex((p) => p.id === decoded.after);
      if (decoded.scope !== signature || index < 0) throw new Error();
      start = index + 1;
    } catch {
      throw new CatalogQueryError("invalid_cursor");
    }
  }
  const page = items.slice(start, start + query.limit);
  const last = page.at(-1);
  const nextCursor =
    start + page.length < items.length && last
      ? Buffer.from(
          JSON.stringify({ v: 1, after: last.id, scope: signature }),
        ).toString("base64url")
      : null;
  return { items: page, nextCursor };
}
