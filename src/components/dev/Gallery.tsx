import { getTranslations } from "next-intl/server";
import tokens from "@/styles/tokens.json";
import { ProductImage } from "@/components/ui/ProductImage";
export async function Gallery() {
  const t = await getTranslations({ locale: "uz", namespace: "common" });
  return (
    <main>
      <h1 className="type-heading-xl">{t("gallery")}</h1>
      <section>
        <h2 className="type-heading-lg">{t("colors")}</h2>
        <div className="samples">
          {Object.keys(tokens.colors).map((name) => (
            <div key={name}>
              <div
                className="swatch"
                style={{ background: `var(--colors-${name})` }}
              />
              <p className="type-caption-sm">{name}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg">{t("type")}</h2>
        {Object.keys(tokens.typography).map((name) => (
          <div className="sample" key={name}>
            <p className="type-caption-sm text-mute">{name}</p>
            {["inter", "oswald"].map((font) => (
              <div key={font} className={`type-${name} font-${font}`}>
                <p lang="uz">{t("sample")}</p>
                <p lang="ru">{t("sample")}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
      <section>
        <h2 className="type-heading-lg">{t("spacing")}</h2>
        {Object.entries(tokens.spacing).map(([name, value]) => (
          <div key={name} className="flex gap-md items-center mb-md">
            <div
              className="bg-ink"
              style={{
                width: `var(--spacing-${name})`,
                height: `var(--spacing-${name})`,
              }}
            />
            <span>
              {name} · {value}
            </span>
          </div>
        ))}
      </section>
      <section>
        <h2 className="type-heading-lg">{t("radius")}</h2>
        <div className="samples">
          {Object.keys(tokens.rounded).map((name) => (
            <div
              key={name}
              className="sample bg-soft-cloud"
              style={{ borderRadius: `var(--rounded-${name})` }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="type-heading-lg">{t("placeholder")}</h2>
        <div className="max-w-sm">
          <ProductImage alt={t("placeholder")} />
        </div>
      </section>
    </main>
  );
}
