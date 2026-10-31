import { it, expect, vi, afterEach } from "vitest";
import { catalogRepositoryContract } from "@/test/contracts/catalogRepository";
import { MockCatalogRepository } from "./catalog";
import { catalogSeed } from "./seed";
catalogRepositoryContract(
  "MockCatalogRepository",
  () => new MockCatalogRepository(),
  catalogSeed.products,
);
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("returns isolated data so caller mutations do not corrupt the source", async () => {
  const repo = new MockCatalogRepository();
  const slug = catalogSeed.products[0].slug;
  const product = await repo.getProductBySlug(slug);
  if (!product) throw new Error("Fixture missing");
  product.name.uz = "changed";
  expect((await repo.getProductBySlug(slug))?.name.uz).toBe(
    catalogSeed.products[0].name.uz,
  );
  expect(await repo.getPageBySlug("about")).toBeTruthy();
  expect(await repo.getPageBySlug("missing")).toBeNull();
  expect(await repo.listPages()).toHaveLength(5);
});
it("simulates deterministic 300ms development latency outside tests", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("VITEST", "false");
  vi.useFakeTimers();
  let done = false;
  const pending = new MockCatalogRepository().listBanners().then(() => {
    done = true;
  });
  await vi.advanceTimersByTimeAsync(299);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  await pending;
  expect(done).toBe(true);
});
