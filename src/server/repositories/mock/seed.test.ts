import { describe, it, expect } from "vitest";
import { catalogSeed } from "./seed";
import {
  productSchema,
  categorySchema,
  productSummarySchema,
} from "@/features/catalog/schemas";
import { categoryTree, toSummary } from "@/server/services/catalog";
import { brand } from "@/config/brand";
describe("deterministic seed contract", () => {
  it("has 8 roots, 3 children per root and 30 valid full products", () => {
    const tree = categoryTree(catalogSeed);
    expect(tree).toHaveLength(8);
    tree.forEach((root) => {
      expect(categorySchema.safeParse(root).success).toBe(true);
      expect(root.children).toHaveLength(3);
    });
    expect(catalogSeed.products).toHaveLength(30);
    catalogSeed.products.forEach((p) => {
      expect(productSchema.safeParse(p).success).toBe(true);
      expect(productSummarySchema.safeParse(toSummary(p)).success).toBe(true);
      expect(p.price).toBeGreaterThanOrEqual(150000);
      expect(p.price).toBeLessThanOrEqual(25000000);
      expect(p.name.uz).toBeTruthy();
      expect(p.name.ru).toBeTruthy();
      expect(Object.keys(p.attributes).length).toBeGreaterThanOrEqual(5);
      expect(Object.keys(p.attributes).length).toBeLessThanOrEqual(10);
    });
  });
  it("has unique identities/slugs/SKUs and valid acyclic parents/references", () => {
    for (const list of [
      catalogSeed.categories,
      catalogSeed.brands,
      catalogSeed.products,
      catalogSeed.pages,
    ])
      expect(new Set(list.map((item) => item.slug)).size).toBe(list.length);
    expect(new Set(catalogSeed.products.map((p) => p.sku)).size).toBe(30);
    const categories = new Map(catalogSeed.categories.map((c) => [c.id, c]));
    for (const category of catalogSeed.categories) {
      const visited = new Set<string>();
      let node: typeof category | undefined = category;
      while (node) {
        expect(visited.has(node.id)).toBe(false);
        visited.add(node.id);
        if (node.parentId) expect(categories.has(node.parentId)).toBe(true);
        node = node.parentId ? categories.get(node.parentId) : undefined;
      }
    }
    for (const product of catalogSeed.products) {
      expect(categories.has(product.categoryId)).toBe(true);
      expect(catalogSeed.brands.some((b) => b.id === product.brandId)).toBe(
        true,
      );
      const parent = categories.get(product.categoryId)?.parentId;
      for (const [key, value] of Object.entries(product.attributes)) {
        const def = catalogSeed.attributeDefs.find(
          (d) => d.categoryId === parent && d.key === key,
        );
        expect(def).toBeDefined();
        expect(def?.values).toContain(value);
      }
    }
  });
  it("includes the required stock, discount, brand, image and variant cases", () => {
    expect(catalogSeed.brands.map((b) => b.name)).toEqual([
      "Aurora",
      "Nordix",
      "Kelvin",
      "Vita",
      "Orbit",
      "Lumo",
    ]);
    expect(catalogSeed.products.filter((p) => p.stock === 0)).toHaveLength(3);
    expect(
      catalogSeed.products.filter((p) => p.stock > 0 && p.stock <= 3),
    ).toHaveLength(4);
    expect(catalogSeed.products.filter((p) => p.oldPrice)).toHaveLength(10);
    expect(catalogSeed.products.some((p) => p.images.length === 0)).toBe(true);
    expect(
      catalogSeed.products.some((p) => p.images[0]?.path === brand.placeholder),
    ).toBe(true);
    expect(
      catalogSeed.products.filter((p) => p.variants.length > 0).length,
    ).toBeGreaterThan(1);
    expect(catalogSeed.banners).toHaveLength(4);
    expect(catalogSeed.pages).toHaveLength(5);
    catalogSeed.pages.forEach((p) => {
      expect(p.body.uz.startsWith("# ")).toBe(true);
      expect(p.body.ru.startsWith("# ")).toBe(true);
    });
  });
});
