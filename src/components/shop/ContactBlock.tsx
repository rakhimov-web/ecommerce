import { useTranslations } from "next-intl";
import { brand } from "@/config/brand";
export function ContactBlock() {
  const t = useTranslations("home");
  return (
    <section className="home-section contact-block">
      <h2 className="type-heading-lg">{t("contacts")}</h2>
      <p className="type-caption-md text-mute">{t("demoContacts")}</p>
      <dl>
        <div>
          <dt>{t("phone")}</dt>
          <dd>{brand.phone}</dd>
        </div>
        <div>
          <dt>{t("address")}</dt>
          <dd>{brand.address}</dd>
        </div>
        <div>
          <dt>{t("hours")}</dt>
          <dd>{brand.hours}</dd>
        </div>
      </dl>
    </section>
  );
}
