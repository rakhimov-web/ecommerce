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
        viewBox="0 0 75 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chap yuqori burchakdagi 3D orqaga qayrilgan burchak (fold flap) */}
        <path d="M 0 3.8 L 6.2 0 L 6.2 4.2 Z" fill={foldColor} />

        {/* Yuqori va pastki qirrasida chuqur yarim doira o'yig'i bo'lgan ixcham chipta tanasi */}
        <path
          d="M 0 3.8 
             L 33 6.6 
             A 6 6 0 0 0 44.6 7.6 
             L 71.6 10.4 
             Q 75 10.8 75 13.5 
             L 75 41 
             Q 75 44 71.6 44 
             L 40.6 41.4 
             A 6 6 0 0 0 29 40.4 
             L 3.2 38.2 
             Q 0 37.8 0 35.2 
             L 0 3.8 
             Z"
          fill={mainColor}
        />

        {/* Chipta markazidagi oq qalin matn — biroz kattalashtirilgan */}
        <text
          x="37.5"
          y="24.8"
          fill="var(--white)"
          fontSize="12.2"
          fontWeight="800"
          fontFamily="var(--font-primary)"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing="0.9"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default TicketBadge;
