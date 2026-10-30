"use client";
import { useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "./IconButton";
export function SearchPill({
  value,
  defaultValue = "",
  onValueChange,
  label,
  disabled = false,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("ui");
  const [internal, setInternal] = useState(defaultValue);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const current = value ?? internal;
  function update(next: string) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }
  return (
    <div className="search-pill">
      <Search size={20} aria-hidden="true" />
      <label htmlFor={id} className="sr-only">
        {label ?? t("search")}
      </label>
      <input
        ref={input}
        id={id}
        type="search"
        value={current}
        disabled={disabled}
        placeholder={label ?? t("search")}
        onChange={(e) => update(e.target.value)}
      />
      {current && (
        <IconButton
          aria-label={t("clear")}
          disabled={disabled}
          onClick={() => {
            update("");
            input.current?.focus();
          }}
        >
          <X size={20} />
        </IconButton>
      )}
    </div>
  );
}
