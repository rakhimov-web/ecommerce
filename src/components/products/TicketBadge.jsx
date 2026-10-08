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
        viewBox="0 0 74 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chap yuqori burchakdagi 3D orqaga qayrilgan burchak (fold flap) */}
        <path d="M 0 3.3 L 6.3 0 L 6.3 4.0 Z" fill={foldColor} />

        {/* Yuqori va pastki qirrasida chuqur yarim doira o'yig'i (notches) bo'lgan dinamik qiya chipta tanasi */}
        <path
          d="M 0 3.3 
             L 0 33.5 
             Q 0 36.2 2.8 35.6 
             L 29.1 37.3 
             A 5.6 5.6 0 0 1 40.2 36.7 
             L 71.0 39.3 
             Q 74.0 39.5 74.0 37.2 
             L 74.0 11.8 
             Q 74.0 9.5 71.0 10.0 
             L 44.1 8.3 
             A 5.6 5.6 0 0 1 33.0 6.2 
             L 6.3 4.0 
             L 0 3.3 
             Z"
          fill={mainColor}
        />

        {/* Chipta markazidagi oq qalin matn — sayt shrifti va proporsional o'lcham */}
        <text
          x="37"
          y="23.5"
          fill="var(--white)"
          fontSize="11.5"
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
