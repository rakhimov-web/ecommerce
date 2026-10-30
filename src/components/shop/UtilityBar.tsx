import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
export function UtilityBar() {
  const locale = useLocale();
  const t = useTranslations("ui");
  return (
    <div className="utility-bar">
      <p>{t("demoNotice")}</p>
      <nav aria-label={t("language")}>
        <Link
          href="/uz"
          lang="uz"
          aria-current={locale === "uz" ? "page" : undefined}
        >
          {t("uz")}
        </Link>
        <Link
          href="/ru"
          lang="ru"
          aria-current={locale === "ru" ? "page" : undefined}
        >
          {t("ru")}
        </Link>
      </nav>
    </div>
  );
}
