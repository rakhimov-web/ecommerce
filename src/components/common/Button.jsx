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
    </button>
  );
};

export default Button;
