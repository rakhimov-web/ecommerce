import type {
  CatalogData,
  Category,
  Product,
  ProductSummary,
  ParsedListQuery,
  ListQuery,
  ListResult,
  Facets,
} from "@/features/catalog/types";
import { listQuerySchema } from "@/features/catalog/schemas";
import { normalizeSearch } from "@/lib/normalizeSearch";
import { discountPercent } from "@/lib/discountPercent";
import { paginate } from "./catalogCursor";
export function categoryIds(data: CatalogData, slug: string): Set<string> {
  const root = data.categories.find((c) => c.slug === slug);
  if (!root) return new Set();
  const found = new Set([root.id]);
  const pending = [root.id];
  while (pending.length) {
    const id = pending.shift();
    for (const child of data.categories)
      if (child.parentId === id && !found.has(child.id)) {
        found.add(child.id);
        pending.push(child.id);
      }
  }
  return found;
}
export function categoryTree(data: CatalogData): Category[] {
  const build = (parent: string | null, ancestors: Set<string>): Category[] =>
    data.categories
      .filter((c) => c.parentId === parent && !ancestors.has(c.id))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
      .map((c) => ({
        ...c,
        children: build(c.id, new Set([...ancestors, c.id])),
      }));
  return build(null, new Set());
}
export function toSummary(product: Product): ProductSummary {
  const { id, slug, name, price, oldPrice, stock, rating, badge, installment } =
    product;
  return {
    id,
    slug,
    name,
    price,
    oldPrice,
    stock,
    rating,
    badge,
    installment,
    image: product.images[0]?.path,
  };
}
export function searchRank(
  data: CatalogData,
  product: Product,
  input: string,
): number {
  const q = normalizeSearch(input);
  if (!q) return 0;
  if (
    [product.sku, product.model, ...product.variants.map((v) => v.sku)].some(
      (text) => normalizeSearch(text) === q,
    )
  )
    return 0;
  const names = [product.name.uz, product.name.ru].map(normalizeSearch);
  if (names.some((name) => name.startsWith(q))) return 1;
  const maker = data.brands.find((b) => b.id === product.brandId);
  const category = data.categories.find((c) => c.id === product.categoryId);
  const pathNames: string[] = [];
  const visited = new Set<string>();
  let node = category;
  while (node && !visited.has(node.id)) {
    visited.add(node.id);
    pathNames.push(node.name.uz, node.name.ru);
    node = data.categories.find((c) => c.id === node?.parentId);
  }
  const haystack = normalizeSearch(
    [product.sku, product.model, ...names, maker?.name, ...pathNames].join(" "),
  );
  const terms = q.split(" ");
  const words = haystack.split(/\s+/);
  if (terms.every((term) => words.includes(term))) return 2;
  return terms.every((term) => haystack.includes(term)) ? 3 : Infinity;
}
export function filterProducts(
  data: CatalogData,
  query: ParsedListQuery,
): Product[] {
  const categories = query.categorySlug
    ? categoryIds(data, query.categorySlug)
    : undefined;
  const brandIds = new Set(
    data.brands
      .filter((b) => query.brandSlugs.includes(b.slug))
      .map((b) => b.id),
  );
  return data.products.filter(
    (p) =>
      p.isActive &&
      (!categories || categories.has(p.categoryId)) &&
      (!query.brandSlugs.length || brandIds.has(p.brandId)) &&
      (query.priceMin === undefined || p.price >= query.priceMin) &&
      (query.priceMax === undefined || p.price <= query.priceMax) &&
      (!query.inStock || p.stock > 0) &&
      (!query.discounted || (p.oldPrice ?? 0) > p.price) &&
      Object.entries(query.attributes).every(([key, values]) =>
        values.some(
          (value) =>
            normalizeSearch(String(value)) ===
            normalizeSearch(String(p.attributes[key] ?? "")),
        ),
      ) &&
      Number.isFinite(searchRank(data, p, query.q)),
  );
}
export function sortProducts(
  data: CatalogData,
  items: Product[],
  query: ParsedListQuery,
): Product[] {
  return [...items].sort((a, b) => {
    const relevance = query.q
      ? searchRank(data, a, query.q) - searchRank(data, b, query.q)
      : 0;
    if (relevance) return relevance;
    const order =
      query.sort === "priceAsc"
        ? a.price - b.price
        : query.sort === "priceDesc"
          ? b.price - a.price
          : query.sort === "newest"
            ? b.createdAt.localeCompare(a.createdAt)
            : query.sort === "discount"
              ? discountPercent(b.price, b.oldPrice ?? b.price) -
                discountPercent(a.price, a.oldPrice ?? a.price)
              : b.salesCount - a.salesCount;
    return order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });
}
// Conjunctive facets describe the entire filtered result, never just its page.
export function computeFacets(data: CatalogData, items: Product[]): Facets {
  const prices = items.map((p) => p.price);
  const attributes: Facets["attributes"] = {};
  const keys = new Set(
    data.attributeDefs.filter((a) => a.filterable).map((a) => a.key),
  );
  for (const key of [...keys].sort()) {
    const counts = new Map<
      string,
      { value: string | number | boolean; count: number }
    >();
    for (const item of items) {
      const value = item.attributes[key];
      if (value === undefined) continue;
      const id = JSON.stringify(value);
      const prior = counts.get(id);
      counts.set(id, { value, count: (prior?.count ?? 0) + 1 });
    }
    if (counts.size)
      attributes[key] = [...counts.values()].sort((a, b) =>
        typeof a.value === "number" && typeof b.value === "number"
          ? a.value - b.value
          : String(a.value).localeCompare(String(b.value)),
      );
  }
  return {
    brands: data.brands
      .map((b) => ({
        slug: b.slug,
        name: b.name,
        count: items.filter((p) => p.brandId === b.id).length,
      }))
      .filter((b) => b.count > 0),
    price: {
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
    },
    attributes,
    inStock: items.filter((p) => p.stock > 0).length,
    discounted: items.filter((p) => (p.oldPrice ?? 0) > p.price).length,
  };
}
export function listCatalog(
  data: CatalogData,
  input: ListQuery = {},
): ListResult {
  const query = listQuerySchema.parse(input);
  const items = sortProducts(data, filterProducts(data, query), query);
  const page = paginate(items, query);
  return {
    items: page.items.map(toSummary),
    nextCursor: page.nextCursor,
    total: items.length,
    facets: computeFacets(data, items),
  };
}
