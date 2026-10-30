import { useTranslations } from "next-intl";
import { PackageOpen } from "lucide-react";
export function PlaceholderPage({
  page,
}: {
  page: "home" | "catalog" | "cart" | "favorites" | "profile";
}) {
  const t = useTranslations("tabs");
  const ui = useTranslations("ui");
  return (
    <main className="placeholder-page">
      <p className="type-caption-md text-mute">{ui("stage")}</p>
      <h1 className="type-heading-xl">{t(page)}</h1>
      <div className="empty-state">
        <PackageOpen size={64} strokeWidth={1.75} aria-hidden="true" />
        <h2 className="type-heading-lg">{ui("comingSoon")}</h2>
        <p className="text-mute">{ui("placeholderCopy")}</p>
      </div>
    </main>
  );
}
