import Link from "next/link";
import Image from "next/image";
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
  return (
    <main>
      <Image
        src={brand.logo}
        alt={brand.name}
        width={220}
        height={60}
        priority
      />
      <section>
        <h1 className="type-heading-xl">{brand.name}</h1>
        <p className="type-body-md text-mute">{t("intro")}</p>
        <nav className="flex gap-xl">
          <Link href="/uz" lang="uz">
            {(await getTranslations({ locale: "uz", namespace: "common" }))(
              "language",
            )}
          </Link>
          <Link href="/ru" lang="ru">
            {(await getTranslations({ locale: "ru", namespace: "common" }))(
              "language",
            )}
          </Link>
        </nav>
      </section>
    </main>
  );
}
