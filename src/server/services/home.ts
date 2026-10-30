import type { CatalogRepository } from "@/server/repositories/catalog";
import { catalogRepository } from "@/server/repositories";
export async function getHomeData(
  repository: CatalogRepository = catalogRepository,
) {
  const [categories, banners, rails, products] = await Promise.all([
    repository.listCategoryTree(),
    repository.listBanners(),
    repository.listRails(),
    repository.listProducts({ limit: 8 }),
  ]);
  return { categories, banners, rails, products };
}
