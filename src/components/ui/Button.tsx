"use client";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
export type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline-on-image";
  size?: "md" | "sm";
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  "aria-label"?: string;
  "data-state"?: string;
};
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  href,
  onClick,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  const blocked = disabled || loading;
  const cls = `button button-${variant} button-${size} ${className}`;
  const content = (
    <>
      <span
        aria-hidden={loading || undefined}
        className={loading ? "button-label invisible" : "button-label"}
      >
        {children}
      </span>
      {loading && (
        <>
          <span className="sr-only">{children}</span>
          <span className="spinner" aria-hidden="true" />
        </>
      )}
    </>
  );
  if (href && blocked)
    return (
      <a
        {...rest}
        role="link"
        className={cls}
        aria-busy={loading || undefined}
        aria-disabled="true"
        tabIndex={-1}
        onClick={(e) => e.preventDefault()}
      >
        {content}
      </a>
    );
  if (href)
    return (
      <Link
        {...rest}
        href={href}
        className={cls}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        tabIndex={blocked ? -1 : undefined}
        onClick={(e) => {
          if (blocked) e.preventDefault();
          else onClick?.(e);
        }}
      >
        {content}
      </Link>
    );
  return (
    <button
      {...rest}
      type={type}
      className={cls}
      disabled={blocked}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
