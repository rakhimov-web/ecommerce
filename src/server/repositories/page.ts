import type { InfoPage } from "@/features/catalog/types";
export interface PageRepository {
  getPageBySlug(slug: string): Promise<InfoPage | null>;
  listPages(): Promise<InfoPage[]>;
}
