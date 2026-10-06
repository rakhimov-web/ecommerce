import { useState } from "react";
import { Search, Heart, RotateCw, X } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge";
import { useApp } from "../../context/useApp";
import { BRAND_CONFIG } from "../../config/brand";
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Yuqori brend logo qatori (Telegram Fullscreen da markazlashgan professional logo) */}
        <div className={styles.topLogoRow}>
          <div
            className={styles.brandLogo}
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            aria-label={`${BRAND_CONFIG.name} do'koni`}
          >
            <span className={styles.brandName}>{BRAND_CONFIG.name}</span>
            <span className={styles.brandDot} />
          </div>
        </div>

        {/* Qidiruv maydoni va harakatlar tugmalari qatori */}
        <div className={styles.actionRow}>
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
    </div>
  </header>
  );
};

export default Header;
