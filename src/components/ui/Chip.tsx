import type { ButtonHTMLAttributes, ReactNode } from "react";
export function Chip({
  active = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      aria-pressed={active}
      className={`chip ${active ? "chip-active" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
export function ChipRow({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="chip-row">
      {children}
    </div>
  );
}
