import type { CatalogRepository } from "../catalog";
import type { BannerRepository } from "../banner";
import type { PageRepository } from "../page";
import type {
  CatalogData,
  ListQuery,
  Suggestion,
} from "@/features/catalog/types";
import {
  boundedLimitSchema,
  listQuerySchema,
} from "@/features/catalog/schemas";
import {
  categoryTree,
  listCatalog,
  filterProducts,
  computeFacets,
  searchRank,
  toSummary,
} from "@/server/services/catalog";
import { normalizeSearch } from "@/lib/normalizeSearch";
import { catalogSeed } from "./seed";
export class MockCatalogRepository
  implements CatalogRepository, BannerRepository, PageRepository
{
  private readonly data: CatalogData;
  constructor(data: CatalogData = catalogSeed) {
    this.data = structuredClone(data);
  }
  private async answer<T>(value: T): Promise<T> {
    if (process.env.NODE_ENV === "development" && process.env.VITEST !== "true")
      await new Promise((resolve) => setTimeout(resolve, 300));
    return structuredClone(value);
  }
  async listCategoryTree() {
    return this.answer(categoryTree(this.data));
  }
  async getCategoryBySlug(slug: string) {
    return this.answer(
      this.data.categories.find((c) => c.slug === slug) ?? null,
    );
  }
  async listProducts(query: ListQuery = {}) {
    return this.answer(listCatalog(this.data, query));
  }
  async getProductBySlug(slug: string) {
    return this.answer(
      this.data.products.find((p) => p.slug === slug && p.isActive) ?? null,
    );
  }
  async getFacets(input: ListQuery = {}) {
    const query = listQuerySchema.parse(input);
    return this.answer(
      computeFacets(this.data, filterProducts(this.data, query)),
    );
  }
  async getRelated(productId: string, limit = 8) {
    boundedLimitSchema.parse(limit);
    const product = this.data.products.find((p) => p.id === productId);
    if (!product) return this.answer([]);
    const items = this.data.products
      .filter((p) => p.isActive && p.id !== productId)
      .sort(
        (a, b) =>
          Number(b.categoryId === product.categoryId) -
            Number(a.categoryId === product.categoryId) ||
          Number(b.brandId === product.brandId) -
            Number(a.brandId === product.brandId) ||
          b.salesCount - a.salesCount ||
          a.id.localeCompare(b.id),
      );
    return this.answer(items.slice(0, limit).map(toSummary));
  }
  async suggest(input: string, limit = 8): Promise<Suggestion[]> {
    boundedLimitSchema.parse(limit);
    const q = listQuerySchema.parse({ q: input }).q;
    if (normalizeSearch(q).length < 2) return this.answer([]);
    const products = this.data.products
      .filter((p) => p.isActive && Number.isFinite(searchRank(this.data, p, q)))
      .sort(
        (a, b) =>
          searchRank(this.data, a, q) - searchRank(this.data, b, q) ||
          a.id.localeCompare(b.id),
      )
      .map((p) => ({ type: "product" as const, slug: p.slug, name: p.name }));
    const categories = this.data.categories
      .filter((c) =>
        normalizeSearch(`${c.name.uz} ${c.name.ru}`).includes(
          normalizeSearch(q),
        ),
      )
      .map((c) => ({ type: "category" as const, slug: c.slug, name: c.name }));
    return this.answer([...products, ...categories].slice(0, limit));
  }
  async listRails() {
    return this.answer({
      discounted: listCatalog(this.data, {
        discounted: true,
        sort: "discount",
        limit: 8,
      }).items,
      newest: listCatalog(this.data, { sort: "newest", limit: 8 }).items,
      popular: listCatalog(this.data, { sort: "popular", limit: 8 }).items,
    });
  }
  async listBanners() {
    return this.answer(
      this.data.banners
        .filter((b) => b.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
        .slice(0, 5),
    );
  }
  async listPages() {
    return this.answer(this.data.pages.slice(0, 48));
  }
  async getPageBySlug(slug: string) {
    return this.answer(this.data.pages.find((p) => p.slug === slug) ?? null);
  }
}
