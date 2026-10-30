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
  function toSlots(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 6);
    return Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
  }
  // Keep editing positions locally. The public value remains digits-only; echoing
  // that value from a controlled parent must not collapse an empty middle slot.
  const [draft, setDraft] = useState(() => ({
    slots: toSlots(defaultValue),
    emitted: defaultValue,
  }));
  const slots =
    value === undefined || value === draft.emitted
      ? draft.slots
      : toSlots(value);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  function update(index: number, text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 6 - index);
    if (text && !digits) return;
    const next = [...slots];
    if (!text) next[index] = "";
    else
      Array.from(digits).forEach((digit, offset) => {
        next[index + offset] = digit;
      });
    const emitted = next.join("");
    setDraft({ slots: next, emitted });
    onValueChange?.(emitted);
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
            value={slots[i]}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={t("otpDigit", { number: i + 1 })}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            maxLength={1}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => update(i, e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              update(i, e.clipboardData.getData("text"));
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !slots[i])
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
