import { useState, useRef } from "react";
import styles from "./button.module.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  isLoading = false,
  icon = null,
  className = "",
  style,
  "aria-label": ariaLabel,
  ...rest
}) => {
  const [ripples, setRipples] = useState([]);
  const rippleCounter = useRef(0);

  const handlePointerDown = (e) => {
    if (disabled || isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX ||
        (e.touches && e.touches[0]?.clientX) ||
        rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY ||
        (e.touches && e.touches[0]?.clientY) ||
        rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;
    setRipples((prev) => [...prev, { id: rippleId, x: rippleX, y: rippleY }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 550);
  };

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant] || styles.primary} ${
        styles[size] || styles.md
      } ${fullWidth ? styles.fullWidth : ""} ${
        isLoading ? styles.loading : ""
      } ${disabled ? styles.disabled : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {icon && <span className={styles.iconWrap}>{icon}</span>}
          {children && <span className={styles.label}>{children}</span>}
        </>
      )}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
          }}
        />
      ))}
    </button>
  );
};

export default Button;
