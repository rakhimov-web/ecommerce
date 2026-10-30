import { catalogRepository } from "@/server/repositories";
import { parseListParams, catalogError } from "@/server/services/catalogApi";
export async function GET(request: Request) {
  try {
    const query = parseListParams(new URL(request.url).searchParams);
    return Response.json({
      ok: true,
      data: await catalogRepository.listProducts(query),
    });
  } catch (error) {
    return catalogError(error);
  }
}
