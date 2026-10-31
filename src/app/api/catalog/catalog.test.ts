import { it, expect, vi, afterEach } from "vitest";
import { GET as products } from "./products/route";
import { GET as suggest } from "./suggest/route";
import { catalogRepository } from "@/server/repositories";
afterEach(() => vi.restoreAllMocks());
it("products returns default and explicit bounded envelopes", async () => {
  const response = await products(
    new Request("http://local/api/catalog/products"),
  );
  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.data.items).toHaveLength(24);
  expect(json.data.total).toBe(30);
  const limited = await products(
    new Request("http://local/api/catalog/products?limit=2&inStock=true"),
  );
  expect((await limited.json()).data.items).toHaveLength(2);
});
it.each([
  "limit=49",
  "limit=0",
  "limit=oops",
  "inStock=0",
  "discounted=yes",
  "priceMin=100&priceMax=1",
  "attributes=bad",
  "cursor=garbage",
  "unknown=true",
])("rejects invalid query %s safely", async (query) => {
  const response = await products(
    new Request(`http://local/api/catalog/products?${query}`),
  );
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({
    ok: false,
    error: { code: "INVALID_QUERY" },
  });
});
it("parses repeated/comma brands and JSON attributes", async () => {
  const params = new URLSearchParams({
    brandSlugs: "nordix",
    attributes: JSON.stringify({ ram: [4, 32] }),
    categorySlug: "computers",
  });
  const response = await products(
    new Request(`http://local/api/catalog/products?${params}`),
  );
  expect(response.status).toBe(200);
  expect((await response.json()).data.total).toBe(2);
});
it("suggest validates and bounds results", async () => {
  const response = await suggest(
    new Request("http://local/api/catalog/suggest?q=Aurora&limit=2"),
  );
  expect(response.status).toBe(200);
  expect((await response.json()).data.length).toBeLessThanOrEqual(2);
  expect(
    (await suggest(new Request("http://local/api/catalog/suggest?limit=49")))
      .status,
  ).toBe(400);
  expect(
    (await suggest(new Request("http://local/api/catalog/suggest?q=x"))).status,
  ).toBe(200);
});
it("does not expose internal error details", async () => {
  vi.spyOn(catalogRepository, "listProducts").mockRejectedValueOnce(
    new Error("private diagnostic"),
  );
  const response = await products(
    new Request("http://local/api/catalog/products"),
  );
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    ok: false,
    error: { code: "CATALOG_UNAVAILABLE" },
  });
});
