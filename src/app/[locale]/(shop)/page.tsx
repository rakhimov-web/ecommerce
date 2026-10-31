import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHomeData } from "@/server/services/home";
import { BannerCarousel } from "@/components/shop/BannerCarousel";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { QuickChips } from "@/components/shop/QuickChips";
import { ProductRail } from "@/components/shop/ProductRail";
import { InfiniteProductGrid } from "@/components/shop/InfiniteProductGrid";
import { ContactBlock } from "@/components/shop/ContactBlock";
import { brand } from "@/config/brand";
import { env } from "@/lib/env";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const data = await getHomeData();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: env.SITE_URL,
    logo: new URL(brand.logo, env.SITE_URL).href,
  };
  return (
    <main className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\u003c"),
        }}
      />
      <h1 className="sr-only">{t("title", { store: brand.name })}</h1>
      <BannerCarousel banners={data.banners} />
      <CategoryGrid categories={data.categories} />
      <QuickChips />
      <ProductRail
        title={t("discounted")}
        products={data.rails.discounted}
        href="/catalog?discounted=true"
      />
      <ProductRail
        title={t("newest")}
        products={data.rails.newest}
        href="/catalog?sort=newest"
      />
      <ProductRail
        title={t("popular")}
        products={data.rails.popular}
        href="/catalog?sort=popular"
      />
      <InfiniteProductGrid key={locale} initial={data.products} />
      <ContactBlock />
    </main>
  );
}
