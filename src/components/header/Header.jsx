import { useState } from "react";
import { Search, Heart, ShoppingCart, X } from "lucide-react";
import styles from "./header.module.css";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Qidiruv maydoni (O'zbekcha) */}
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Nimani qidiryapsiz?"
            className={styles.searchInput}
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
