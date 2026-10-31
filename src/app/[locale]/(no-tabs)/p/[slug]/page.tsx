import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { catalogRepository } from "@/server/repositories";
import { BackBar } from "@/components/shop/BackBar";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await catalogRepository.getProductBySlug(slug);
  if (!product) notFound();
  const t = await getTranslations("home");
  return (
    <main>
      <BackBar title={product.name[locale === "ru" ? "ru" : "uz"]} />
      <p className="my-xl">{t("productSoon")}</p>
    </main>
  );
}
