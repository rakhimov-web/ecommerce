import type { z } from "zod";
import type * as schemas from "./schemas";
export type Localized = z.infer<typeof schemas.localizedSchema>;
export type CategoryNode = z.infer<typeof schemas.categoryNodeSchema>;
export type Category = z.infer<typeof schemas.categorySchema>;
export type Brand = z.infer<typeof schemas.brandSchema>;
export type AttributeDef = z.infer<typeof schemas.attributeDefSchema>;
export type AttributeValue = z.infer<typeof schemas.attributeValueSchema>;
export type Product = z.infer<typeof schemas.productSchema>;
export type ProductSummary = z.infer<typeof schemas.productSummarySchema>;
export type ProductImage = z.infer<typeof schemas.productImageSchema>;
export type Variant = z.infer<typeof schemas.variantSchema>;
export type Banner = z.infer<typeof schemas.bannerSchema>;
export type InfoPage = z.infer<typeof schemas.infoPageSchema>;
export type ListQuery = z.input<typeof schemas.listQuerySchema>;
export type ParsedListQuery = z.output<typeof schemas.listQuerySchema>;
export type ListResult = z.infer<typeof schemas.listResultSchema>;
export type Facets = z.infer<typeof schemas.facetsSchema>;
export type Rails = {
  discounted: ProductSummary[];
  newest: ProductSummary[];
  popular: ProductSummary[];
};
export type Suggestion = {
  type: "product" | "category";
  slug: string;
  name: Localized;
};
export type CatalogData = {
  categories: CategoryNode[];
  brands: Brand[];
  attributeDefs: AttributeDef[];
  products: Product[];
  banners: Banner[];
  pages: InfoPage[];
};
