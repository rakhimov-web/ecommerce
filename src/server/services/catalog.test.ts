import { describe, it, expect } from "vitest";
import { catalogSeed } from "@/server/repositories/mock/seed";
import { listCatalog, categoryTree, searchRank } from "./catalog";
import { CatalogQueryError } from "./catalogCursor";
import { sortSchema } from "@/features/catalog/schemas";
const ids = (query: Parameters<typeof listCatalog>[1]) =>
  listCatalog(catalogSeed, { limit: 48, ...query }).items.map((p) => p.id);
describe("catalog filters", () => {
  it("includes descendants and only the requested leaf", () => {
    expect(ids({ categorySlug: "gadgets", sort: "priceAsc" })).toEqual([
      "product-01",
      "product-09",
      "product-17",
      "product-25",
    ]);
    expect(ids({ categorySlug: "phones", sort: "priceAsc" })).toEqual([
      "product-01",
      "product-25",
    ]);
    expect(ids({ categorySlug: "missing" })).toEqual([]);
    expect(categoryTree(catalogSeed)).toHaveLength(8);
  });
  it("filters brand slugs, including OR selection", () => {
    expect(ids({ brandSlugs: ["aurora"] })).toHaveLength(5);
    expect(ids({ brandSlugs: ["aurora", "nordix"] })).toHaveLength(10);
    expect(ids({ brandSlugs: ["missing"] })).toEqual([]);
  });
  it("uses inclusive price bounds", () =>
    expect(
      ids({ priceMin: 150000, priceMax: 1250000, sort: "priceAsc" }),
    ).toEqual(["product-01", "product-02", "product-03"]));
  it("handles stock and discount independently and together", () => {
    expect(ids({ inStock: true })).toHaveLength(27);
    expect(ids({ discounted: true })).toHaveLength(10);
    expect(ids({ inStock: true, discounted: true })).toHaveLength(9);
  });
  it("combines all filter families and attribute OR/AND semantics", () => {
    expect(
      ids({
        categorySlug: "computers",
        brandSlugs: ["nordix"],
        attributes: { ram: [4], color: ["white", "black"] },
        inStock: true,
        priceMin: 600000,
        priceMax: 1000000,
      }),
    ).toEqual(["product-02"]);
    expect(ids({ attributes: { color: ["black", "white"] } })).toHaveLength(20);
    expect(ids({ attributes: { missing: ["value"] } })).toEqual([]);
    expect(ids({ attributes: { quiet: [true] } }).length).toBeGreaterThan(0);
  });
  it("excludes inactive products", () => {
    const data = structuredClone(catalogSeed);
    data.products[0].isActive = false;
    expect(listCatalog(data, { limit: 48 }).total).toBe(29);
  });
});
describe("search", () => {
  it("matches SKU/model exactly, Latin and Cyrillic fields", () => {
    expect(ids({ q: "demo-d001" })[0]).toBe("product-01");
    expect(ids({ q: "D001" })[0]).toBe("product-01");
    expect(ids({ q: "СМАРТФОНЫ" }).length).toBeGreaterThan(0);
    expect(ids({ q: "smartfonlar" }).length).toBeGreaterThan(0);
    expect(ids({ q: "no-such-product" })).toEqual([]);
  });
  it("normalizes apostrophes and case", () => {
    const expected = ids({ q: "mikrotoʻlqinli" });
    expect(expected.length).toBeGreaterThan(0);
    for (const query of ["MIKROTO'LQINLI", "mikroto‘lqinli", "mikrotoʼlqinli"])
      expect(ids({ q: query })).toEqual(expected);
  });
  it("ranks exact model before name prefix, word and contains", () => {
    const data = structuredClone(catalogSeed);
    data.products = data.products.slice(0, 4);
    const names = [
      "Unrelated",
      "Pocket device",
      "Vita pocket device",
      "VitaPocketDevice",
    ];
    data.products.forEach((p, i) => {
      p.model = i === 0 ? "pocket" : `other-${i}`;
      p.name = { uz: names[i], ru: names[i] };
      p.salesCount = i * 100;
    });
    expect(data.products.map((p) => searchRank(data, p, "pocket"))).toEqual([
      0, 1, 2, 3,
    ]);
    expect(listCatalog(data, { q: "POCKET" }).items.map((p) => p.id)).toEqual(
      data.products.map((p) => p.id),
    );
  });
});
describe("stable sorts and cursors", () => {
  it("orders every supported sort", () => {
    expect(ids({ sort: "priceAsc" })[0]).toBe("product-01");
    expect(ids({ sort: "priceDesc" })[0]).toBe("product-30");
    expect(ids({ sort: "popular" })[0]).toBe("product-01");
    expect(ids({ sort: "newest" })[0]).toBe("product-28");
    expect(ids({ sort: "discount" }).slice(0, 10)).toEqual(
      catalogSeed.products.filter((p) => p.oldPrice).map((p) => p.id),
    );
  });
  it.each(sortSchema.options)("breaks %s ties by id", (sort) => {
    const data = structuredClone(catalogSeed);
    const first = data.products[0];
    data.products = [
      { ...first, id: "tie-b" },
      { ...first, id: "tie-a" },
    ];
    expect(listCatalog(data, { sort }).items.map((p) => p.id)).toEqual([
      "tie-a",
      "tie-b",
    ]);
  });
  it.each(sortSchema.options)(
    "paginates the full %s seed without gaps or duplicates",
    (sort) => {
      const seen: string[] = [];
      let cursor: string | undefined;
      do {
        const page = listCatalog(catalogSeed, { sort, limit: 7, cursor });
        seen.push(...page.items.map((p) => p.id));
        expect(page.items.length).toBeLessThanOrEqual(7);
        cursor = page.nextCursor ?? undefined;
      } while (cursor);
      expect(seen).toEqual(ids({ sort }));
      expect(new Set(seen).size).toBe(30);
    },
  );
  it("binds cursors to filters and sort, but allows changing page size", () => {
    const first = listCatalog(catalogSeed, { limit: 5 });
    const cursor = first.nextCursor ?? "";
    expect(
      listCatalog(catalogSeed, { cursor, limit: 3 }).items.map((p) => p.id),
    ).toEqual(ids({}).slice(5, 8));
    expect(() =>
      listCatalog(catalogSeed, { cursor, sort: "priceDesc" }),
    ).toThrow(CatalogQueryError);
    expect(() => listCatalog(catalogSeed, { cursor, inStock: true })).toThrow(
      CatalogQueryError,
    );
  });
  it.each(["bad!", "YWJj", "e30", ""])(
    "rejects malformed cursors %s",
    (cursor) => {
      if (cursor === "")
        return expect(() => listCatalog(catalogSeed, { cursor: "=" })).toThrow(
          CatalogQueryError,
        );
      expect(() => listCatalog(catalogSeed, { cursor })).toThrow(
        CatalogQueryError,
      );
    },
  );
  it("defaults to 24 and enforces a hard max of 48", () => {
    expect(listCatalog(catalogSeed).items).toHaveLength(24);
    expect(listCatalog(catalogSeed, { limit: 48 }).items).toHaveLength(30);
    expect(() => listCatalog(catalogSeed, { limit: 49 })).toThrow();
    expect(() => listCatalog(catalogSeed, { limit: 0 })).toThrow();
    expect(() =>
      listCatalog(catalogSeed, { priceMin: 2, priceMax: 1 }),
    ).toThrow();
  });
});
describe("conjunctive facets", () => {
  it("describes the full set independently of page size", () => {
    const first = listCatalog(catalogSeed, { limit: 1 });
    expect(first.total).toBe(30);
    expect(first.facets.inStock).toBe(27);
    expect(first.facets.discounted).toBe(10);
    expect(first.facets.price).toEqual({ min: 150000, max: 25000000 });
    expect(first.facets.brands.map((b) => b.count)).toEqual([5, 5, 5, 5, 5, 5]);
    expect(first.facets.attributes.color).toEqual([
      { value: "black", count: 10 },
      { value: "silver", count: 10 },
      { value: "white", count: 10 },
    ]);
    expect(first.facets).toEqual(
      listCatalog(catalogSeed, { limit: 48 }).facets,
    );
  });
  it("respects combined filters and empty results", () => {
    const page = listCatalog(catalogSeed, {
      categorySlug: "computers",
      brandSlugs: ["nordix"],
    });
    expect(page.facets.brands).toEqual([
      { slug: "nordix", name: "Nordix", count: 2 },
    ]);
    expect(page.facets.attributes.ram).toEqual([
      { value: 4, count: 1 },
      { value: 32, count: 1 },
    ]);
    const empty = listCatalog(catalogSeed, { q: "does-not-exist" });
    expect(empty.facets).toEqual({
      brands: [],
      price: { min: null, max: null },
      attributes: {},
      inStock: 0,
      discounted: 0,
    });
    expect(empty.nextCursor).toBeNull();
  });
});
