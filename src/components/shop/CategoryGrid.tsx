import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  WashingMachine,
  AirVent,
  CookingPot,
  House,
  LayoutGrid,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Category } from "@/features/catalog/types";
const icons = {
  smartphone: Smartphone,
  laptop: Laptop,
  tv: Tv,
  fridge: Refrigerator,
  washer: WashingMachine,
  air: AirVent,
  kitchen: CookingPot,
  home: House,
};
export function CategoryGrid({ categories }: { categories: Category[] }) {
  const locale = useLocale();
  const t = useTranslations("home");
  return (
    <nav className="category-grid" aria-label={t("categories")}>
      {categories.slice(0, 7).map((category) => {
        const Icon = icons[category.icon];
        return (
          <Link key={category.id} href={`/${locale}/c/${category.slug}`}>
            <span className="category-icon">
              <Icon size={72} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="type-caption-md line-clamp-2">
              {category.name[locale === "ru" ? "ru" : "uz"]}
            </span>
          </Link>
        );
      })}
      <Link href={`/${locale}/catalog`}>
        <span className="category-icon">
          <LayoutGrid size={72} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="type-caption-md">{t("allCategories")}</span>
      </Link>
    </nav>
  );
}
