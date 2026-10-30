"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("home");
  return (
    <main className="empty-state">
      <h1 className="type-heading-lg">{t("loadError")}</h1>
      <Button variant="secondary" onClick={reset}>
        {t("retry")}
      </Button>
    </main>
  );
}
