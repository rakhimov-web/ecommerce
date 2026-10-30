import { z } from "zod";
import { catalogRepository } from "@/server/repositories";
import { catalogError } from "@/server/services/catalogApi";
const schema = z
  .object({
    q: z.string().trim().max(100).default(""),
    limit: z.coerce.number().int().min(1).max(48).default(8),
  })
  .strict();
export async function GET(request: Request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    const query = schema.parse(params);
    return Response.json({
      ok: true,
      data: await catalogRepository.suggest(query.q, query.limit),
    });
  } catch (error) {
    return catalogError(error);
  }
}
