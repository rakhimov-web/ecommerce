import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackBar } from "@/components/shop/BackBar";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ui");
  return (
    <main>
      <BackBar title={t("about")} />
      <p>{t("placeholderCopy")}</p>
    </main>
  );
}
