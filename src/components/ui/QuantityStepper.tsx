"use client";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "./IconButton";
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const t = useTranslations("ui");
  return (
    <div className="quantity-stepper" role="group" aria-label={t("quantity")}>
      <IconButton
        aria-label={t("decrease")}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={20} />
      </IconButton>
      <span className="quantity-number" key={value} aria-live="polite">
        {value}
      </span>
      <IconButton
        aria-label={t("increase")}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={20} />
      </IconButton>
    </div>
  );
}
