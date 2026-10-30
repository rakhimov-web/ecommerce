import type { ButtonHTMLAttributes } from "react";
export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label": string;
  variant?: "soft" | "ink";
};
export function IconButton({
  variant = "soft",
  children,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`icon-button icon-${variant} ${className}`}
    >
      <span className="icon-face">{children}</span>
    </button>
  );
}
