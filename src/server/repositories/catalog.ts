import type {
  Category,
  CategoryNode,
  Product,
  ProductSummary,
  ListQuery,
  ListResult,
  Facets,
  Rails,
  Banner,
  Suggestion,
} from "@/features/catalog/types";
export interface CatalogRepository {
  listCategoryTree(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<CategoryNode | null>;
  listProducts(query?: ListQuery): Promise<ListResult>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getRelated(productId: string, limit?: number): Promise<ProductSummary[]>;
  suggest(q: string, limit?: number): Promise<Suggestion[]>;
  getFacets(query?: ListQuery): Promise<Facets>;
  listRails(): Promise<Rails>;
  listBanners(): Promise<Banner[]>;
}
