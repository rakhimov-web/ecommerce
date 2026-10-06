import { useState, useEffect } from "react";
import { Search, Heart, RotateCw, X } from "lucide-react";
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
  const [searchValue, setSearchValue] = useState("");

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
  };

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

  // Smart collapsible header: faqat topda to'liq ko'rinadi, scroll qilsa smooth yuqoriga kirib ketadi
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY =
        window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(currentY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
    >
      {/* 1-QATOR: Markaziy NOVA brend logo qatori (scroll qilinganda silliq kirib ketadi) */}
      <TopBrandBar onLogoClick={handleLogoClick} isCollapsed={isScrolled} />

      {/* 2-QATOR: Asl qidiruv va tugmalar qatori (doimo barqaror va ochiq turadi) */}
      <div className={styles.container}>
        {/* Qidiruv maydoni (bosilganda to'g'ridan-to'g'ri SearchPage ga o'tadi) */}
        <div
          className={styles.searchBox}
          onClick={handleSearchBoxClick}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            readOnly={!!onSearchClick}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={handleSearchBoxClick}
            placeholder="Mahsulot va toifalarni qidirish"
            className={styles.searchInput}
            style={{ cursor: onSearchClick ? "pointer" : "text" }}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearBtn}
              aria-label="Tozalash"
            >
              <X size={15} />
            </button>
          )}
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
