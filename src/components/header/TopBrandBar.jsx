import logoSvg from "../../assets/icons/logo.svg";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./topBrandBar.module.css";

const TopBrandBar = ({ onLogoClick }) => {
  const handleClick = () => {
    triggerHaptic("selection");
    if (onLogoClick) {
      onLogoClick();
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.topBrandBar}>
      {/* Chap taraf: Telegram nativ Back/Close tugmasi zonasi */}
      <div className={styles.tgSideZone} aria-hidden="true" />

      {/* Markaz: Barcha sahifalar uchun o'zgarmas, professional SVG logotipi (X va Y bo'yicha mutlaq markazda) */}
      <div className={styles.logoCenter}>
        <button
          type="button"
          className={styles.brandLogo}
          onClick={handleClick}
          aria-label="Nova do'koni"
        >
          <img
            src={logoSvg}
            alt="Nova"
            className={styles.logoSvg}
            draggable={false}
          />
        </button>
      </div>

      {/* O'ng taraf: Telegram nativ Options/More (...) menyu tugmasi zonasi */}
      <div className={styles.tgSideZone} aria-hidden="true" />
    </div>
  );
};

export default TopBrandBar;

