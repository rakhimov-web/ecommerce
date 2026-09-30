import { useState } from "react";
import { Search, Heart, ShoppingCart, X } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge";
import styles from "./header.module.css";

const Header = ({ onSearchClick, likedCount = 3, cartCount = 2 }) => {
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

  return (
    <header className={styles.header}>
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

        {/* O'ng tarafdagi harakatlar: Sevimlilar (3 ta) va Savatcha (2 ta) */}
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
            className={styles.iconBtn}
            aria-label="Savatcha"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            <NotificationBadge
              count={cartCount}
              className={styles.headerBadge}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
