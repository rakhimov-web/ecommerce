"use client";
import { useRef, useState, useId } from "react";
import { useTranslations } from "next-intl";
export function OtpInput({
  value,
  defaultValue = "",
  onValueChange,
  label,
  disabled = false,
  error,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  disabled?: boolean;
  error?: string;
}) {
  const t = useTranslations("ui");
  const errorId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  function update(index: number, text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 6 - index);
    const next = (
      current.slice(0, index) +
      digits +
      current.slice(index + Math.max(digits.length, 1))
    ).slice(0, 6);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    if (digits) refs.current[Math.min(index + digits.length, 5)]?.focus();
  }
  return (
    <fieldset className="field otp-field" disabled={disabled}>
      <legend className="type-caption-md">{label}</legend>
      <div className="otp-row">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={current[i] ?? ""}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={t("otpDigit", { number: i + 1 })}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            maxLength={1}
            onChange={(e) => update(i, e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              update(i, e.clipboardData.getData("text"));
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !current[i])
                refs.current[Math.max(0, i - 1)]?.focus();
              if (e.key === "ArrowLeft")
                refs.current[Math.max(0, i - 1)]?.focus();
              if (e.key === "ArrowRight")
                refs.current[Math.min(5, i + 1)]?.focus();
            }}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className="type-caption-sm text-sale" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
