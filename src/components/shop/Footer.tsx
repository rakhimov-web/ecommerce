import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { brand } from "@/config/brand";
export function Footer() {
  const t = useTranslations("ui");
  const locale = useLocale();
  return (
    <footer className="desktop-only footer">
      <div className="footer-columns">
        {["buyers", "help", "about", "offers"].map((key) => (
          <div key={key}>
            <h2 className="type-heading-md">{t(key)}</h2>
            <Link href={`/${locale}/info/demo`}>{t("comingSoon")}</Link>
          </div>
        ))}
      </div>
      <p className="type-caption-sm text-mute">
        {brand.name} · {t("demoNotice")}
      </p>
    </footer>
  );
}
