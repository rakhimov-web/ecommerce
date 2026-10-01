import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Camera,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import styles from "./productFilters.module.css";

const categories = [
  { id: "all", label: "Barchasi", icon: LayoutGrid },
  { id: "cameras", label: "Kameralar", icon: Camera },
  { id: "phones", label: "Smartfonlar", icon: Smartphone },
  { id: "laptops", label: "Noutbuklar", icon: Laptop },
  { id: "audio", label: "Quloqchinlar", icon: Headphones },
  { id: "accessories", label: "Aksessuarlar", icon: Watch },
];

const sortOptions = [
  { id: "popular", label: "Ommabop" },
  { id: "price_asc", label: "Arzonroq" },
  { id: "price_desc", label: "Qimmatroq" },
  { id: "new", label: "Yangi kelganlar" },
];

const availableColors = [
  { id: "space-black", name: "Kosmik qora", hex: "#1c1d1f" },
  { id: "silver", name: "Kumushrang", hex: "#e5e7eb" },
  { id: "deep-blue", name: "To'q ko'k", hex: "#0055ff" },
  { id: "sunset-orange", name: "Olovrang", hex: "#ff6430" },
  { id: "titanium", name: "Titan kulrang", hex: "#8e8e93" },
];

const ProductFilters = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedColor, setSelectedColor] = useState(null);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [priceMax, setPriceMax] = useState(15000000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortDropdownRef = useRef(null);

  // Dropdown tashqarisiga bosilganda uni yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // Faol filtrlar soni
  const activeFiltersCount =
    (selectedColor ? 1 : 0) +
    (onlyDiscount ? 1 : 0) +
    (priceMax < 15000000 ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    if (onFilterChange) {
      onFilterChange({ category: id, sort: selectedSort, color: selectedColor, onlyDiscount, priceMax });
    }
  };

  const handleSortSelect = (id) => {
    setSelectedSort(id);
    setIsSortOpen(false);
    if (onFilterChange) {
      onFilterChange({ category: selectedCategory, sort: id, color: selectedColor, onlyDiscount, priceMax });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSort("popular");
    setSelectedColor(null);
    setOnlyDiscount(false);
    setPriceMax(15000000);
    if (onFilterChange) {
      onFilterChange({ category: "all", sort: "popular", color: null, onlyDiscount: false, priceMax: 15000000 });
    }
    setIsModalOpen(false);
  };

  const handleApplyModal = () => {
    setIsModalOpen(false);
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        sort: selectedSort,
        color: selectedColor,
        onlyDiscount,
        priceMax,
      });
    }
  };

  // Tanlangan sort varianti matni
  const currentSortLabel =
    sortOptions.find((opt) => opt.id === selectedSort)?.label || "Ommabop";

  return (
    <div className={styles.filterSection}>
      <div className={styles.container}>
        {/* 1. Yuqori Kategoriya Tablari (Apple-style Kichik Iconli Squircle Badge) */}
        <div className={styles.categoriesTrack}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`${styles.categoryPill} ${
                  isActive ? styles.activeCategoryPill : ""
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className={styles.pillBackground}
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className={styles.pillContent}>
                  <span className={styles.iconBox}>
                    <Icon size={14} strokeWidth={2} />
                  </span>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Tezkor Filtr & Custom Tartiblash Qatori */}
        <div className={styles.subFilterBar}>
          <div className={styles.leftFilters}>
            {/* Asosiy filtr modalini ochuvchi tugma */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`${styles.filterActionBtn} ${
                activeFiltersCount > 0 ? styles.hasActiveFilter : ""
              }`}
            >
              <SlidersHorizontal size={15} />
              <span>Filtrlar</span>
              {activeFiltersCount > 0 && (
                <span className={styles.filterCountBadge}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Rang filtri (tezkor tanlash) */}
            <div className={styles.colorPillsGroup}>
              {availableColors.map((color) => {
                const isColorSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() =>
                      setSelectedColor(isColorSelected ? null : color.id)
                    }
                    className={`${styles.colorDotBtn} ${
                      isColorSelected ? styles.activeColorDot : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                    title={color.name}
                  >
                    {isColorSelected && (
                      <Check
                        size={12}
                        color={color.id === "silver" ? "var(--black)" : "var(--white)"}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Professional Custom Tartiblash Dropdown (Qo'lbola) */}
          <div className={styles.customSortWrapper} ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`${styles.sortTriggerBtn} ${
                isSortOpen ? styles.sortTriggerActive : ""
              }`}
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <ArrowUpDown size={14} className={styles.sortTriggerIcon} />
              <span className={styles.sortCurrentText}>{currentSortLabel}</span>
              <motion.span
                animate={{ rotate: isSortOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={styles.chevronWrap}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>

            {/* Ochiluvchi Dropdown Menyusi */}
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  className={styles.sortDropdownMenu}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="listbox"
                >
                  {sortOptions.map((opt) => {
                    const isSelected = selectedSort === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSortSelect(opt.id)}
                        className={`${styles.sortOptionItem} ${
                          isSelected ? styles.selectedSortOption : ""
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <Check size={14} className={styles.optionCheckIcon} />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 4. Apple-style Filtr Modali (Bottom Sheet) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              className={styles.modalSheet}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className={styles.modalHeader}>
                <div className={styles.dragPill} />
                <div className={styles.modalTitleRow}>
                  <h3 className={styles.modalTitle}>Barcha filtrlar</h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.closeModalBtn}
                    aria-label="Yopish"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.modalBody}>
                {/* Narx oralig'i */}
                <div className={styles.filterGroup}>
                  <div className={styles.filterGroupHeader}>
                    <span className={styles.filterGroupTitle}>Maksimal narx</span>
                    <span className={styles.priceValue}>
                      {Number(priceMax).toLocaleString("uz-UZ")} so'm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="15000000"
                    step="250000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className={styles.priceRangeSlider}
                  />
                  <div className={styles.rangeLabels}>
                    <span>500 000 so'm</span>
                    <span>15 000 000 so'm</span>
                  </div>
                </div>

                {/* Mahsulot rangi */}
                <div className={styles.filterGroup}>
                  <span className={styles.filterGroupTitle}>Ranglar</span>
                  <div className={styles.modalColorList}>
                    {availableColors.map((color) => {
                      const isColorSelected = selectedColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() =>
                            setSelectedColor(isColorSelected ? null : color.id)
                          }
                          className={`${styles.modalColorItem} ${
                            isColorSelected ? styles.selectedModalColor : ""
                          }`}
                        >
                          <span
                            className={styles.modalColorSwatch}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isColorSelected && (
                              <Check
                                size={12}
                                color={color.id === "silver" ? "var(--black)" : "var(--white)"}
                                strokeWidth={3}
                              />
                            )}
                          </span>
                          <span className={styles.modalColorName}>
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Faqat chegirmadagilar toggle */}
                <div className={styles.toggleRow}>
                  <div className={styles.toggleText}>
                    <span className={styles.toggleTitle}>
                      Faqat chegirmadagi mahsulotlar
                    </span>
                    <span className={styles.toggleSubtitle}>
                      Aksiya va arzonlashtirilgan narxlar
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOnlyDiscount(!onlyDiscount)}
                    className={`${styles.switchBtn} ${
                      onlyDiscount ? styles.switchActive : ""
                    }`}
                    role="switch"
                    aria-checked={onlyDiscount}
                  >
                    <motion.div
                      className={styles.switchHandle}
                      animate={{ x: onlyDiscount ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetBtn}
                >
                  <RotateCcw size={15} />
                  <span>Tozalash</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyModal}
                  className={styles.applyBtn}
                >
                  Filtrni qo'llash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
