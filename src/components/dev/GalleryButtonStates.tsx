"use client";
import { useTranslations, useLocale } from "next-intl";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
export function GalleryButtonStates() {
  const t = useTranslations("ui");
  const locale = useLocale();
  return (
    <section className="gallery-section">
      <h2 className="type-heading-lg">{t("buttons")}</h2>
      <p className="text-mute mb-xl">{t("hoverNote")}</p>
      <div className="gallery-actions">
        {(["primary", "secondary", "outline-on-image"] as const).map(
          (variant, i) => (
            <Button key={variant} variant={variant}>
              {t(["default", "secondary", "outline"][i])}
            </Button>
          ),
        )}
        <Button size="sm">{t("small")}</Button>
        <Button data-state="pressed">{t("pressed")}</Button>
        <Button className="demo-focus">{t("focused")}</Button>
        <Button disabled>{t("disabled")}</Button>
        <Button loading>{t("loading")}</Button>
        <Button href={`/${locale}`}>{t("long")}</Button>
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
