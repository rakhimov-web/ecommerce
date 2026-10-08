import styles from "./productGrid.module.css";

const TicketBadge = ({ type }) => {
  if (!type) return null;

  const isAksiya = type.toLowerCase() === "aksiya";
  const label = isAksiya ? "AKSIYA" : "YANGI";
  // Sayt brendi ranglari: AKSIYA uchun olovrang (--accent), YANGI uchun yashil (--success)
  const mainColor = isAksiya ? "var(--accent)" : "var(--success)";
  const foldColor = isAksiya ? "var(--accent-dark)" : "var(--success-dark)";

  return (
    <div className={styles.badgeWrapper} aria-label={label}>
      <svg
        className={styles.ticketSvg}
        viewBox="0 0 75 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chap yuqori burchakdagi 3D orqaga qayrilgan burchak (fold flap) */}
        <path d="M 0 4.4 L 6.4 0 L 6.4 4.8 Z" fill={foldColor} />

        {/* Yuqori va pastki qirrasida chuqur yarim doira o'yig'i (notches) bo'lgan asosiy chipta tanasi */}
        <path
          d="M 0 4.4 
             L 33 7.6 
             A 6 6 0 0 0 44.6 8.8 
             L 71.6 12 
             Q 74.8 12.4 74.8 15.2 
             L 74.8 48.4 
             Q 74.8 51.6 71.6 51.6 
             L 40.6 48.6 
             A 6 6 0 0 0 29 47.4 
             L 3.2 44.8 
             Q 0 44.4 0 41.6 
             L 0 4.4 
             Z"
          fill={mainColor}
        />

        {/* Chipta markazidagi oq qalin matn */}
        <text
          x="37.5"
          y="29"
          fill="var(--white)"
          fontSize="11"
          fontWeight="800"
          fontFamily="var(--font-primary)"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing="0.8"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default TicketBadge;
