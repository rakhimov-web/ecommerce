import { MockCatalogRepository } from "./mock/catalog";
import type { CatalogRepository } from "./catalog";
import type { PageRepository } from "./page";
import type { BannerRepository } from "./banner";
const mock = new MockCatalogRepository();
export const catalogRepository: CatalogRepository = mock;
export const bannerRepository: BannerRepository = mock;
export const pageRepository: PageRepository = mock;
