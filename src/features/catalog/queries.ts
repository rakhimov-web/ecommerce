import { z } from "zod";
import { listResultSchema } from "./schemas";
const responseSchema = z.object({
  ok: z.literal(true),
  data: listResultSchema,
});
export async function fetchProductPage(cursor: string, signal?: AbortSignal) {
  const response = await fetch(
    `/api/catalog/products?limit=8&cursor=${encodeURIComponent(cursor)}`,
    { signal },
  );
  if (!response.ok) throw new Error("Catalog request failed");
  const json: unknown = await response.json();
  return responseSchema.parse(json).data;
}
