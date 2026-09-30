import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight, Zap } from "lucide-react";
import { productsData, formatPrice } from "../../data/products";
import EmptyStateVector from "./EmptyStateVector";
import styles from "./appSearchModal.module.css";

import telefonImg from "../../assets/categories/telefon.png";
import noutbukImg from "../../assets/categories/noutbuk.png";
import ipadImg from "../../assets/categories/ipad.png";
import watchImg from "../../assets/categories/apple-watch.png";
import aksessuarlarImg from "../../assets/categories/aksessuarlar.png";

const CATEGORIES = [
  {
    id: "telefon",
    title: "Telefon",
    subtitle: "Apple iPhone va smartfonlar",
    icon: telefonImg,
  },
  {
    id: "noutbuk",
    title: "Noutbuk",
    subtitle: "Apple MacBook va kompyuterlar",
    icon: noutbukImg,
  },
  {
    id: "ipad",
    title: "iPad",
    subtitle: "Apple iPad va planshetlar",
    icon: ipadImg,
  },
  {
    id: "apple-watch",
    title: "Apple Watch",
    subtitle: "Apple Watch va aqlli soatlar",
    icon: watchImg,
  },
  {
    id: "aksessuarlar",
    title: "Aksessuarlar",
    subtitle: "AirPods, g'iloflar va boshqa jihozlar",
    icon: aksessuarlarImg,
  },
];

const QUICK_CHIPS = [
  "iPhone 15 Pro",
  "MacBook Pro 16",
  "iPad Pro 11 M4",
  "Apple Watch Ultra 2",
  "AirPods Pro 2",
];

const AppSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Modal ochilganda avtomatik fokus qilish
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // ESC tugmasi bosilganda yopish
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Qidiruv natijalari
  const trimmed = query.trim().toLowerCase();
  const hasQuery = trimmed.length > 0;

  const filteredProducts = hasQuery
    ? productsData.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          (p.category && p.category.toLowerCase().includes(trimmed))
      )
    : [];

  const isNotFound = hasQuery && filteredProducts.length === 0;

  const handleSelectProduct = (_product) => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalBox}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Qidiruv Headeri */}
            <div className={styles.modalHeader}>
              <Search size={20} className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mahsulot yoki toifani qidirish..."
                className={styles.searchInput}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className={styles.clearBtn}
                  aria-label="Tozalash"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={styles.escBadge}
                title="Yopish"
              >
                ESC
              </button>
            </div>

            {/* Modal Tanasi */}
            <div className={styles.modalBody}>
              {/* 1-HOLAT: Qidiruv bo'sh bo'lganda (Kategoriyalar va tezkor takliflar) */}
              {!hasQuery && (
                <div>
                  {/* Tezkor takliflar */}
                  <h4 className={styles.sectionTitle}>Tezkor qidiruv</h4>
                  <div className={styles.chipsRow}>
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setQuery(chip)}
                        className={styles.chipBtn}
                      >
                        <Zap size={13} className="text-amber-500" />
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>

                  {/* 5 ta toifaning Table/List ro'yxati (media_1790692262832) */}
                  <h4 className={styles.sectionTitle}>Toifalar</h4>
                  <div className={styles.categoryList}>
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className={styles.categoryItem}
                        onClick={() => setQuery(cat.title)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.categoryLeft}>
                          <div className={styles.catIconWrap}>
                            <img
                              src={cat.icon}
                              alt={cat.title}
                              className={styles.catImg}
                              draggable={false}
                            />
                          </div>
                          <div className={styles.catText}>
                            <span className={styles.catTitle}>{cat.title}</span>
                            <span className={styles.catSubtitle}>
                              {cat.subtitle}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className={styles.chevronIcon} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2-HOLAT: Natijalar topilganda */}
              {hasQuery && !isNotFound && (
                <div>
                  <h4 className={styles.sectionTitle}>
                    Topilgan mahsulotlar ({filteredProducts.length})
                  </h4>
                  <div className={styles.productsList}>
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className={styles.productRow}
                        onClick={() => handleSelectProduct(prod)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.productLeft}>
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className={styles.productThumb}
                            loading="lazy"
                          />
                          <div className={styles.productInfo}>
                            <span className={styles.productTitle}>
                              {prod.title}
                            </span>
                            <div className={styles.productMeta}>
                              <span className={styles.productPrice}>
                                {formatPrice(prod.price)}
                              </span>
                              {prod.oldPrice && (
                                <span className={styles.productOldPrice}>
                                  {formatPrice(prod.oldPrice)}
                                </span>
                              )}
                              <span className={styles.productCategory}>
                                • {prod.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={styles.selectIndicator}>Ko'rish →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3-HOLAT: Mahsulot topilmaganda (Empty State) */}
              {isNotFound && (
                <div className={styles.emptyBox}>
                  <EmptyStateVector width={130} height={110} />
                  <h3 className={styles.emptyTitle}>Bunday mahsulot topilmadi</h3>
                  <p className={styles.emptySubtitle}>
                    "{query}" so'rovi bo'yicha hech qanday natija topilmadi.
                    Qidiruv so'zini tekshiring yoki toifalardan birini tanlang.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className={styles.resetBtn}
                  >
                    Qidiruvni tozalash
                  </button>
                </div>
              )}
            </div>

            {/* Modal Pastki paneli (Shortcuts) */}
            <div className={styles.modalFooter}>
              <div className={styles.footerLeft}>
                <span className={styles.shortcutHint}>
                  <kbd className={styles.kbdKey}>ESC</kbd> yopish
                </span>
                <span className={styles.shortcutHint}>
                  <kbd className={styles.kbdKey}>↵</kbd> ochish
                </span>
              </div>
              <span>12 ta mahsulot mavjud</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppSearchModal;
