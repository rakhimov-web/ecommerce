import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ProductSummary } from "@/features/catalog/types";
import { ProductCard } from "./ProductCard";
export function ProductRail({
  title,
  products,
  href,
}: {
  title: string;
  products: ProductSummary[];
  href: string;
}) {
  const locale = useLocale();
  const t = useTranslations("home");
  return (
    <section className="home-section" aria-label={title}>
      <div className="home-section-heading">
        <h2 className="type-heading-xl">{title}</h2>
        <Link href={`/${locale}${href}`}>{t("seeAll")}</Link>
      </div>
      {products.length ? (
        <div className="product-rail">
          {products.slice(0, 48).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-mute">{t("empty")}</p>
      )}
    </section>
  );
}
