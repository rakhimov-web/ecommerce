import { BRAND_CONFIG } from "../../config/brand";
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
      {/* Chap taraf: Telegram nativ Back/Close tugmasi zonasi (48px - 56px) */}
      <div className={styles.tgSideZone} aria-hidden="true" />

      {/* Markaz: Barcha sahifalar uchun o'zgarmas, professional NOVA brend logotipi */}
      <div className={styles.logoCenter}>
        <div
          className={styles.brandLogo}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={`${BRAND_CONFIG.name} do'koni`}
        >
          <span className={styles.brandName}>{BRAND_CONFIG.name}</span>
          <span className={styles.brandDot} />
        </div>
      </div>

      {/* O'ng taraf: Telegram nativ Options/More (...) menyu tugmasi zonasi (48px - 56px) */}
      <div className={styles.tgSideZone} aria-hidden="true" />
    </div>
  );
};

export default TopBrandBar;
