"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/IconButton";
export function BackBar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("ui");
  return (
    <header className="back-bar">
      <IconButton
        aria-label={t("back")}
        onClick={onBack ?? (() => router.back())}
      >
        <ArrowLeft size={24} />
      </IconButton>
      <h1 className="type-heading-md">{title}</h1>
      <span aria-hidden="true" />
    </header>
  );
}
