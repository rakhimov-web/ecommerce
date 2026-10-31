import type { Banner } from "@/features/catalog/types";
export interface BannerRepository {
  listBanners(): Promise<Banner[]>;
}
