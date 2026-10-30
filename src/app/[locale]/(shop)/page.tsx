import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { brand } from "@/config/brand";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const uz = await getTranslations({ locale: "uz", namespace: "common" });
  const ru = await getTranslations({ locale: "ru", namespace: "common" });
  return (
    <main className="flex flex-col gap-section">
      <header className="flex items-center justify-between gap-md flex-wrap">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={200}
          height={64}
          priority
        />
        <nav className="flex gap-xl" aria-label={t("language")}>
          <Link
            className="py-md"
            href="/uz"
            lang="uz"
            aria-current={locale === "uz" ? "page" : undefined}
          >
            {uz("language")}
          </Link>
          <Link
            className="py-md"
            href="/ru"
            lang="ru"
            aria-current={locale === "ru" ? "page" : undefined}
          >
            {ru("language")}
          </Link>
        </nav>
      </header>
      <section className="flex flex-col gap-xl">
        <p className="type-caption-md text-mute">{t("stage")}</p>
        <h1 className="type-heading-xl">{brand.name}</h1>
        <p className="type-body-md text-mute">{t("intro")}</p>
      </section>
    </main>
  );
}
