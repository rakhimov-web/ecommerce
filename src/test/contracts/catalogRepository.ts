import { beforeEach, describe, it, expect } from "vitest";
import type { CatalogRepository } from "@/server/repositories/catalog";
import type { Product } from "@/features/catalog/types";
import { listResultSchema } from "@/features/catalog/schemas";
// Reuse with a DB-backed factory seeded with the same products in Stage 5.
export function catalogRepositoryContract(
  name: string,
  create: () => CatalogRepository | Promise<CatalogRepository>,
  products: Product[],
) {
  describe(name, () => {
    let repo: CatalogRepository;
    beforeEach(async () => {
      repo = await create();
    });
    it("returns schema-valid bounded pages and complete cursor traversal", async () => {
      const ids: string[] = [];
      let cursor: string | undefined;
      do {
        const page = await repo.listProducts({ cursor, limit: 7 });
        expect(listResultSchema.safeParse(page).success).toBe(true);
        ids.push(...page.items.map((p) => p.id));
        cursor = page.nextCursor ?? undefined;
      } while (cursor);
      expect(new Set(ids).size).toBe(products.length);
      expect([...ids].sort()).toEqual(products.map((p) => p.id).sort());
    });
    it("reads products/categories and uses null for unknown slugs", async () => {
      const product = await repo.getProductBySlug(products[0].slug);
      expect(product?.id).toBe(products[0].id);
      expect(await repo.getProductBySlug("missing-product")).toBeNull();
      expect(await repo.getCategoryBySlug("missing-category")).toBeNull();
      expect((await repo.listCategoryTree()).length).toBeGreaterThan(0);
    });
    it("returns related products without self and bounded suggestions/rails", async () => {
      const related = await repo.getRelated(products[0].id, 3);
      expect(related.length).toBeLessThanOrEqual(3);
      expect(related.every((p) => p.id !== products[0].id)).toBe(true);
      expect(
        (await repo.suggest(products[0].model, 2)).length,
      ).toBeLessThanOrEqual(2);
      expect(await repo.suggest("x", 2)).toEqual([]);
      const rails = await repo.listRails();
      Object.values(rails).forEach((items) =>
        expect(items.length).toBeGreaterThanOrEqual(8),
      );
      expect((await repo.listBanners()).length).toBeLessThanOrEqual(5);
    });
    it("facets match list results and invalid limits reject", async () => {
      expect(await repo.getFacets({ inStock: true })).toEqual(
        (await repo.listProducts({ inStock: true, limit: 1 })).facets,
      );
      await expect(repo.listProducts({ limit: 49 })).rejects.toThrow();
      await expect(repo.getRelated(products[0].id, 49)).rejects.toThrow();
    });
  });
}
