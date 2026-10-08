import { useState, useEffect } from "react";
import { Search, Heart, RotateCw } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge";
import TopBrandBar from "./TopBrandBar";
import { useApp } from "../../context/useApp";
import styles from "./header.module.css";

const Header = ({
  onSearchClick,
  likedCount: propLikedCount,
  onRefresh,
  isRefreshing = false,
}) => {
  const { totalLikedCount } = useApp();
  const likedCount =
    propLikedCount !== undefined ? propLikedCount : totalLikedCount;

  const handleSearchBoxClick = () => {
    if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll qilinganda headerga nozik Apple-uslubidagi ko'tarilish soyasi (elevation) beriladi
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY =
        window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(currentY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerElevated : ""}`}
    >
      {/* 1-QATOR: Markaziy NOVA brend logo qatori (Telegram Fullscreen da Back va Menu tugmalari orasida 100% xavfsiz va markazlashgan) */}
      <TopBrandBar onLogoClick={handleLogoClick} />

      {/* 2-QATOR: Asl qidiruv va tugmalar qatori (doimo barqaror va ochiq turadi) */}
      <div className={styles.container}>
        {/* Qidiruv maydoni (faqat SearchPage ga o'tish vazifasini bajaradi, input fokus bo'lmaydi) */}
        <div
          className={styles.searchBox}
          onClick={handleSearchBoxClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSearchBoxClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Mahsulot va toifalarni qidirish"
        >
          <Search size={18} className={styles.searchIcon} />
          <span className={styles.searchPlaceholder}>
            Mahsulot va toifalarni qidirish
          </span>
        </div>

        {/* O'ng tarafdagi harakatlar: Sevimlilar va Saytni yangilash (Refresh) */}
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Sevimlilar"
          >
            <Heart size={22} strokeWidth={1.8} />
            <NotificationBadge
              count={likedCount}
              className={styles.headerBadge}
            />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${isRefreshing ? styles.refreshBtnActive : ""}`}
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Saytni yangilash"
            title="Yangilash"
          >
            <RotateCw
              size={20}
              strokeWidth={1.8}
              className={`${styles.refreshIcon} ${isRefreshing ? styles.spinAnimation : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
