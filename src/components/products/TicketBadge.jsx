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
        viewBox="0 0 74 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chap qirradagi 3D orqaga qayrilgan burchak (fold flap) */}
        <path d="M 0 5.2 L 6.5 1.5 L 6.5 6.8 Z" fill={foldColor} />

        {/* Yuqori va pastki qirrasida yarim doira o'yig'i (notches) bo'lgan dinamik qiya chipta tanasi */}
        <path
          d="M 0 5.2 
             L 0 31.5 
             Q 0 33.6 2.5 33.0 
             L 30.5 35.8 
             A 4.8 4.8 0 0 1 40.5 36.8 
             L 70.0 39.8 
             Q 74.0 40.0 74.0 37.0 
             L 74.0 12.0 
             Q 74.0 9.2 70.0 9.6 
             L 40.5 6.6 
             A 4.8 4.8 0 0 1 30.5 5.6 
             L 6.5 3.2 
             L 0 5.2 
             Z"
          fill={mainColor}
        />

        {/* Chipta markazidagi oq qalin matn — qiyalik bo'yicha tabiiy burchakda joylashgan */}
        <text
          x="37"
          y="22.5"
          transform="rotate(3.5 37 22.5)"
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
