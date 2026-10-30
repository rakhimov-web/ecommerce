"use client";
import { useTranslations, useLocale } from "next-intl";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
export function GalleryButtonStates() {
  const t = useTranslations("ui");
  const locale = useLocale();
  const variants = ["primary", "secondary", "outline-on-image"] as const;
  return (
    <section className="gallery-section">
      <h2 className="type-heading-lg">{t("buttons")}</h2>
      <p className="text-mute mb-xl">{t("hoverNote")}</p>
      <div className="gallery-controls">
        {variants.map((variant, i) => (
          <article className="gallery-state" key={variant}>
            <h3 className="type-heading-md">
              {t(["default", "secondary", "outline"][i])}
            </h3>
            <Button variant={variant}>{t("default")}</Button>
            <Button variant={variant} size="sm">
              {t("small")}
            </Button>
            <Button variant={variant} data-state="pressed">
              {t("pressed")}
            </Button>
            <Button variant={variant} className="demo-focus">
              {t("focused")}
            </Button>
            <Button variant={variant} disabled>
              {t("disabled")}
            </Button>
            <Button variant={variant} loading>
              {t("loading")}
            </Button>
            <Button variant={variant} href={`/${locale}`}>
              {t("long")}
            </Button>
          </article>
        ))}
      </div>
      <div className="gallery-actions mt-xl">
        <IconButton aria-label={t("sample")}>
          <Heart size={24} />
        </IconButton>
        <IconButton variant="ink" aria-label={t("sample")}>
          <Plus size={24} />
        </IconButton>
        <IconButton disabled aria-label={t("disabled")}>
          <Plus size={24} />
        </IconButton>
      </div>
    </section>
  );
}
