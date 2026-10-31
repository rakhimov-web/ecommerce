import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { brand } from "@/config/brand";
export function QuickChips() {
  const locale = useLocale();
  const t = useTranslations("home");
  return (
    <nav className="chip-row home-chips" aria-label={t("quickLinks")}>
      {[
        { key: "discounted", query: "discounted=true" },
        { key: "newest", query: "sort=newest" },
        { key: "popular", query: "sort=popular" },
        ...(brand.features.installment
          ? [{ key: "installment", query: "installment=true" }]
          : []),
      ].map((item) => (
        <Link
          className="chip"
          key={item.key}
          href={`/${locale}/catalog?${item.query}`}
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
