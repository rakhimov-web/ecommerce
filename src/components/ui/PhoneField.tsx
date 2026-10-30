"use client";
import { useId, useState } from "react";
export function PhoneField({
  value,
  defaultValue = "",
  onValueChange,
  label,
  error,
  disabled = false,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  error?: string;
  disabled?: boolean;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const id = useId();
  const current = value ?? internal;
  const digits = current
    .replace(/^\+998/, "")
    .replace(/\D/g, "")
    .slice(0, 9);
  const display = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`field ${error ? "field-error" : ""}`}>
      <label className="type-caption-md" htmlFor={id}>
        {label}
      </label>
      <div className="phone-input">
        <span className="phone-prefix" aria-hidden="true">
          +998
        </span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="tel-national"
          value={display}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => {
            const text = e.target.value;
            const next = text
              .replace(/^\+998/, "")
              .replace(/\D/g, "")
              .slice(0, 9);
            const stored = next ? `+998${next}` : "";
            if (value === undefined) setInternal(stored);
            onValueChange?.(stored);
          }}
        />
      </div>
      {error && (
        <p className="type-caption-sm text-sale" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
