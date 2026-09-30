import styles from "./productGrid.module.css";

const TicketBadge = ({ type }) => {
  if (!type) return null;

  const isAksiya = type.toLowerCase() === "aksiya";
  const label = isAksiya ? "AKSIYA" : "YANGI";
  // AKSIYA uchun brend accent rangi (#ff6430), YANGI uchun brend success yashil (#16a34a)
  const mainColor = isAksiya ? "#ff6430" : "#16a34a";
  const foldColor = isAksiya ? "#cc4410" : "#0f7634";

  return (
    <div className={styles.badgeWrapper} aria-label={label}>
      <svg
        className={styles.ticketSvg}
        viewBox="0 0 68 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rasm ramkasi chetidan aylanib o'tuvchi 3D bukilish (fold) burchagi */}
        <path d="M 6 0 C 3 0 0 2 0 6 L 6 6 Z" fill={foldColor} />

        {/* Tepasida va pastida yarim doira o'yig'i (ticket notch) bo'lgan asosiy chipta tanasi */}
        <path
          d="M 0 6 
             H 29.5 
             A 4.5 4.5 0 0 0 38.5 6 
             H 64 
             Q 68 6 68 10 
             V 23 
             Q 68 27 64 27 
             H 38.5 
             A 4.5 4.5 0 0 0 29.5 27 
             H 0 
             Z"
          fill={mainColor}
        />

        {/* Chipta ichidagi oq qalin matn */}
        <text
          x="34"
          y="16.5"
          fill="#ffffff"
          fontSize="9.8"
          fontWeight="800"
          fontFamily="'Satoshi', system-ui, -apple-system, sans-serif"
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
