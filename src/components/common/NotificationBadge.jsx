import styles from "./notificationBadge.module.css";

/**
 * NotificationBadge — Universal e-commerce bildirishnoma belgisi (Like va Cart badge).
 * Qoidalar:
 * 1. Agar count bo'sh, 0 yoki null bo'lsa qizil/to'q sariq doira umuman render qilinmaydi.
 * 2. 1 xonali sonlar (masalan: 2, 3) — chiroyli doira shaklida bo'ladi.
 * 3. 2 xonali sonlar (masalan: 12, 99) — simmetrik pill (kapsula) ko'rinishida kengayadi.
 * 4. 3 xonali sonlar (masalan: 100+) — "99+" ko'rinishida professional cheklov bilan toshib ketmasdan o'tiradi.
 */
const NotificationBadge = ({ count, max = 99, className = "" }) => {
  const numericCount = Number(count);

  if (!count || isNaN(numericCount) || numericCount <= 0) {
    return null;
  }

  const displayText = numericCount > max ? `${max}+` : String(numericCount);
  const isPill = displayText.length >= 2;

  return (
    <span
      className={`${styles.badge} ${isPill ? styles.pill : ""} ${className}`}
      aria-label={`${displayText} ta element`}
    >
      {displayText}
    </span>
  );
};

export default NotificationBadge;
