import { useState } from "react";
import { Search, Heart, ShoppingCart, X } from "lucide-react";
import styles from "./header.module.css";

const Header = ({ onSearchClick }) => {
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

        {/* O'ng tarafdagi harakatlar: Sevimlilar va Savatcha */}
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Sevimlilar"
          >
            <Heart size={23} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Savatcha"
          >
            <ShoppingCart size={23} strokeWidth={1.8} />
            <span className={styles.cartBadge}>2</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
