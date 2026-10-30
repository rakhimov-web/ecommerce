"use client";
import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
export type TextFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
  helper?: ReactNode;
  error?: string;
};
export function TextField({
  label,
  helper,
  error,
  id: provided,
  className = "",
  ...props
}: TextFieldProps) {
  const generated = useId();
  const id = provided ?? generated;
  const note = error || helper;
  return (
    <div className={`field ${error ? "field-error" : ""} ${className}`}>
      <label className="type-caption-md" htmlFor={id}>
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={
          [props["aria-describedby"], note ? `${id}-note` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {note && (
        <p
          id={`${id}-note`}
          className={`type-caption-sm ${error ? "text-sale" : "text-mute"}`}
        >
          {note}
        </p>
      )}
    </div>
  );
}
