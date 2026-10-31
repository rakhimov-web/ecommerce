import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { catalogRepository } from "@/server/repositories";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = await catalogRepository.getCategoryBySlug(slug);
  if (!category) notFound();
  const t = await getTranslations("home");
  return (
    <main>
      <h1 className="type-heading-xl">
        {category.name[locale === "ru" ? "ru" : "uz"]}
      </h1>
      <p className="my-xl">{t("categorySoon")}</p>
    </main>
  );
}
