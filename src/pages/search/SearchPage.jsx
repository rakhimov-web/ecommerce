import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, Search, X, ChevronRight, Clock } from "lucide-react";
import { productsData } from "../../data/products";
import ProductCard from "../../components/products/ProductCard";
import EmptyStateVector from "../../components/search/EmptyStateVector";
import SmoothImage from "../../components/common/SmoothImage";
import styles from "./searchPage.module.css";

// 5 ta asosiy toifa ikonkalari
import telefonImg from "../../assets/categories/telefon.png";
import noutbukImg from "../../assets/categories/noutbuk.png";
import ipadImg from "../../assets/categories/ipad.png";
import watchImg from "../../assets/categories/apple-watch.png";
import aksessuarlarImg from "../../assets/categories/aksessuarlar.png";

// Asosiy toifalar ro'yxati (media_1790692262832)
const CATEGORIES = [
  {
    id: "telefon",
    title: "Telefon",
    subtitle: "Apple iPhone va smartfonlar",
    icon: telefonImg,
    query: "telefon",
    count: "3 ta model",
  },
  {
    id: "noutbuk",
    title: "Noutbuk",
    subtitle: "Apple MacBook va noutbuklar",
    icon: noutbukImg,
    query: "noutbuk",
    count: "3 ta model",
  },
  {
    id: "ipad",
    title: "iPad",
    subtitle: "Apple iPad va planshetlar",
    icon: ipadImg,
    query: "ipad",
    count: "2 ta model",
  },
  {
    id: "apple-watch",
    title: "Apple Watch",
    subtitle: "Apple Watch va aqlli soatlar",
    icon: watchImg,
    query: "watch",
    count: "2 ta model",
  },
  {
    id: "aksessuarlar",
    title: "Aksessuarlar",
    subtitle: "AirPods va qo'shimcha jihozlar",
    icon: aksessuarlarImg,
    query: "aksessuarlar",
    count: "2 ta model",
  },
];

// Dastlabki qidiruv tarixi
const DEFAULT_RECENT = ["macbook"];

const SearchPage = ({ onBack, initialQuery = "", isActive = false }) => {
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("ecommerce_recent_searches");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_RECENT;
  });

  const inputRef = useRef(null);

  // initialQuery o'zgarganda sinxronlashtirish
  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchValue(initialQuery);
    }
  }, [initialQuery]);

  // Sahifa ochilganda yoki faollashganda (agar bo'sh qidiruv bo'lsa) inputga fokus berish
  useEffect(() => {
    if (isActive && !searchValue && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, searchValue]);

  // URL ni qidiruv so'ziga qarab jonli yangilab borish (/search?q=...)
  const syncUrlWithQuery = (val) => {
    const trimmed = val.trim();
    const newUrl = trimmed
      ? `/search?q=${encodeURIComponent(trimmed)}`
      : "/search";
    window.history.replaceState({ page: "search", query: trimmed }, "", newUrl);
  };

  const handleSearchChange = (val) => {
    setSearchValue(val);
    syncUrlWithQuery(val);
  };

  const saveRecent = (newList) => {
    setRecentSearches(newList);
    try {
      localStorage.setItem(
        "ecommerce_recent_searches",
        JSON.stringify(newList),
      );
    } catch {
      // ignore
    }
  };

  const addRecentQuery = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const filtered = recentSearches.filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    );
    const updated = [trimmed, ...filtered].slice(0, 6);
    saveRecent(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      addRecentQuery(searchValue);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleSelectRecent = (term) => {
    handleSearchChange(term);
    addRecentQuery(term);
  };

  const handleRemoveRecent = (e, termToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== termToRemove);
    saveRecent(updated);
  };

  const handleClearAllRecent = () => {
    saveRecent([]);
  };

  const handleClearInput = () => {
    handleSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCategoryClick = (category) => {
    handleSearchChange(category.title);
    addRecentQuery(category.title);
  };

  // Jonli qidiruv mantiqi (12 ta mahsulot orasidan)
  const query = searchValue.toLowerCase().trim();
  const hasQuery = query.length > 0;

  const filteredProducts = hasQuery
    ? productsData.filter((p) => {
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      })
    : [];

  const isNotFound = hasQuery && filteredProducts.length === 0;

  // Tavsiya etiladigan mahsulotlar: tasodifiy (randomly) aralashtirilgan 4-6 ta Home cardlari
  const randomRecommended = useMemo(() => {
    return [...productsData].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, []);

  return (
    <div className={styles.searchPageContainer}>
      {/*
        100% enli Qidiruv Header (Home pagedagi dizayn, balandlik va fontlar bilan 1-ga 1 mos):
        Chap tomonda: Home header iconBtn o'lcham va uslubidagi ortga qaytish tugmasi
        O'ng tomonda: 100% enli qidiruv inputi
      */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Ortga qaytish tugmasi */}
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label="Bosh sahifaga qaytish"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          {/* 100% qidiruv maydoni (Home search inputi bilan bir xil dizayn) */}
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mahsulot va toifalarni qidirish"
              className={styles.searchInput}
              autoComplete="off"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearInput}
                className={styles.clearBtn}
                aria-label="Tozalash"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Asosiy kontent maydoni */}
      <main className={styles.mainContent}>
        {/* ============================================================
            1-HOLAT: QIDIRUV BO'SH BO'LGANDA (STANDART KO'RINISH)
            1. Yaqinda qidirilganlar tarixi (media_1790693989594.png)
            2. 5 ta toifaning Table/List ro'yxati (media_1790692262832), rasmlar object-fit: cover
            ============================================================ */}
        {!hasQuery && (
          <div className={styles.defaultView}>
            {/* 1. Yaqinda qidirilganlar tarixi */}
            {recentSearches.length > 0 && (
              <section
                className={styles.recentSection}
                aria-label="Qidiruv tarixi"
              >
                <div className={styles.recentHeader}>
                  <h3 className={styles.recentTitle}>
                    Yaqinda shularni qidirgansiz:
                  </h3>
                  <button
                    type="button"
                    onClick={handleClearAllRecent}
                    className={styles.clearHistoryBtn}
                  >
                    Tozalash
                  </button>
                </div>

                <div className={styles.recentList}>
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className={styles.recentItem}
                      onClick={() => handleSelectRecent(term)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.recentItemLeft}>
                        <Clock size={18} className={styles.clockIcon} />
                        <span className={styles.recentText}>{term}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecent(e, term)}
                        className={styles.removeItemBtn}
                        aria-label={`${term}ni tarixdan o'chirish`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. 5 ta toifaning professional table/list ro'yxati */}
            <section
              className={styles.categorySection}
              aria-label="Bo'limlar jadvali"
            >
              <h2 className={styles.categorySectionTitle}>Kategoriyalar</h2>
              <div className={styles.categoryTable}>
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={styles.categoryRow}
                    onClick={() => handleCategoryClick(cat)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.categoryRowLeft}>
                      {/* Squircle konteyner: rasmlar object-fit: cover */}
                      <div className={styles.categoryIconWrap}>
                        <SmoothImage
                          src={cat.icon}
                          alt={cat.title}
                          className={styles.categoryImg}
                          draggable={false}
                        />
                      </div>
                      <div className={styles.categoryTextWrap}>
                        <span className={styles.categoryName}>{cat.title}</span>
                        <span className={styles.categorySubtitle}>
                          {cat.subtitle}
                        </span>
                      </div>
                    </div>
                    <div className={styles.categoryRowRight}>
                      <span className={styles.categoryCount}>{cat.count}</span>
                      <ChevronRight size={18} className={styles.chevronIcon} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            2-HOLAT: MAHSULOT TOPILMAGANDA (EMPTY STATE)
            Ultra-professional Empty State va pastida random Home Cardlari
            ============================================================ */}
        {isNotFound && (
          <div className={styles.notFoundWrapper}>
            <section className={styles.emptyCard} aria-label="Topilmadi">
              <div className={styles.vectorBox}>
                <EmptyStateVector width={160} height={135} />
              </div>
              <h3 className={styles.notFoundTitle}>
                Bunday mahsulot topilmadi
              </h3>
              <p className={styles.notFoundSubtitle}>
                "{searchValue}" so‘rovi bo‘yicha hech qanday mahsulot topilmadi.
                Qidiruv so‘zini tekshirib ko‘ring yoki toifalardan birini
                tanlang.
              </p>
              <button
                type="button"
                onClick={handleClearInput}
                className={styles.resetSearchBtn}
              >
                Qidiruvni tozalash
              </button>
            </section>

            {/* Tavsiya etamiz: Home pagedagi 2-ustunli cardlar tasodifiy (randomly) tartibda */}
            <section
              className={styles.recommendSection}
              aria-label="Tavsiya etamiz"
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Tavsiya qilamiz</h2>
              </div>
              <div className={styles.productGrid}>
                {randomRecommended.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            3-HOLAT: QIDIRUV NATIJALARI TOPILGANDA (HOME CARDLARI)
            Home pagedagi 2-ustunli (desktopda 4) cardlar qidiruv natijasiga moslab chiqadi.
            ============================================================ */}
        {hasQuery && !isNotFound && (
          <section
            className={styles.resultsSection}
            aria-label="Topilgan natijalar"
          >
            <div className={styles.resultsHeaderRow}>
              <h2 className={styles.sectionTitle}>
                Topilgan mahsulotlar{" "}
                <span className={styles.countBadge}>
                  ({filteredProducts.length})
                </span>
              </h2>
            </div>

            {/* 3 talik emas, aynan Home pagedagi cardlar panjarasi */}
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
