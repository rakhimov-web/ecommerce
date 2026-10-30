import { getTranslations } from "next-intl/server";
import { ProductImage } from "@/components/ui/ProductImage";
import { tokenNames } from "@/styles/tokenNames";
export default async function Gallery() {
  const t = await getTranslations({ locale: "uz", namespace: "common" });
  return (
    <main>
      <h1 className="type-heading-xl mb-xl">{t("gallery")}</h1>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("colors")}</h2>
        <div className="gallery-grid">
          {tokenNames.colors.map((name) => (
            <div key={name}>
              <div
                className="swatch"
                style={{ background: `var(--colors-${name})` }}
              />
              <p className="type-caption-sm mt-sm">{name}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("typography")}</h2>
        {tokenNames.typography.map((name) => (
          <article key={name} className="gallery-panel mb-md">
            <h3 className="type-caption-sm text-mute mb-md">{name}</h3>
            {(["inter", "oswald"] as const).map((font) => (
              <div key={font} className={`type-${name} font-${font} mb-lg`}>
                <p className="type-caption-sm text-mute mb-sm">
                  {t(font === "inter" ? "fontInter" : "fontOswald")}
                </p>
                <p lang="uz">{t("sampleUz")}</p>
                <p lang="ru">{t("sampleRu")}</p>
              </div>
            ))}
          </article>
        ))}
      </section>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("spacing")}</h2>
        <div className="gallery-grid">
          {tokenNames.spacing.map((name) => (
            <div className="gallery-panel" key={name}>
              <p className="type-caption-sm mb-sm">{name}</p>
              <div
                className="bg-ink"
                style={{
                  height: `var(--spacing-${name})`,
                  width: `var(--spacing-${name})`,
                }}
              />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("rounded")}</h2>
        <div className="gallery-grid">
          {tokenNames.rounded.map((name) => (
            <div
              className="gallery-panel bg-soft-cloud"
              key={name}
              style={{ borderRadius: `var(--rounded-${name})` }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("motion")}</h2>
        <div className="gallery-grid">
          {tokenNames.motion.map((name) => (
            <p key={name} className="type-caption-sm">
              {name}
            </p>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg mb-lg">{t("placeholder")}</h2>
        <div className="max-w-sm">
          <ProductImage alt={t("placeholder")} />
        </div>
      </section>
    </main>
  );
}
