import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TicketBadge from "../../components/products/TicketBadge";
import SmoothImage from "../../components/common/SmoothImage";
import { formatPrice } from "../../data/products";
import { useApp } from "../../context/useApp";
import styles from "./productDetailPage.module.css";

const ProductDetailPage = ({ product, onBack }) => {
  const {
    getCartQuantity,
    addToCart,
    isLiked: checkIsLiked,
    toggleLike: handleToggleLikeContext,
  } = useApp();

  const quantity = product ? getCartQuantity(product.id) : 0;
  const isLiked = product ? checkIsLiked(product.id) : false;

  // 3 ta variant/burchak rasmlari
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.slice(0, 3);
    }
    return product.image ? [product.image, product.image, product.image] : [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [cartRipples, setCartRipples] = useState([]);
  const [checkoutRipples, setCheckoutRipples] = useState([]);
  const rippleCounter = useRef(0);

  // Mahsulot o'zgarganda birinchi rasmga qaytarish (React render-time adjustment)
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product?.id !== prevProductId) {
    setPrevProductId(product?.id);
    setActiveImageIndex(0);
    setIsDescriptionExpanded(false);
  }

  // Sahifa ochilganda yuqoriga siljitish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [product?.id]);

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <p className={styles.notFoundText}>Mahsulot topilmadi</p>
        <button type="button" onClick={onBack} className={styles.backCtaBtn}>
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  // Barcha tugmalarda bir xil yoyiluvchi professional ripple effekti
  const createRipple = (e, setter) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX ||
        (e.touches && e.touches[0]?.clientX) ||
        rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY ||
        (e.touches && e.touches[0]?.clientY) ||
        rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;
    setter((prev) => [...prev, { id: rippleId, x: rippleX, y: rippleY }]);

    setTimeout(() => {
      setter((prev) => prev.filter((r) => r.id !== rippleId));
    }, 500);
  };

  // Savatga qo'shish tugmasi
  const handleAddToCart = (e) => {
    createRipple(e, setCartRipples);
    addToCart(product.id);
  };

  // Rasmiylashtirish tugmasi (talabga binoan hozircha no-op)
  const handleCheckout = (e) => {
    createRipple(e, setCheckoutRipples);
  };

  // Sevimlilar (Like)
  const handleToggleLike = (e) => {
    e.stopPropagation();
    handleToggleLikeContext(product.id);
  };

  return (
    <div className={styles.pageContainer}>
      {/* ============================================================
          TOP HEADER (media_1790917535726.png):
          - Chapda: Dumaloq ortga qaytish (<) tugmasi
          - O'rtada: Mahsulot nomi (Product Title)
          - O'ngda: Faqatgina dumaloq Sevimlilar (Heart) tugmasi
          ============================================================ */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Ortga qaytish dumaloq tugmasi */}
          <button
            type="button"
            className={styles.headerCircleBtn}
            onClick={onBack}
            aria-label="Ortga qaytish"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>

          {/* O'rtadagi sarlavha */}
          <div className={styles.headerTitleBox}>
            <h1 className={styles.headerTitle}>{product.title}</h1>
          </div>

          {/* O'ngdagi faqat Like tugmasi */}
          <button
            type="button"
            className={`${styles.headerCircleBtn} ${isLiked ? styles.headerLiked : ""}`}
            onClick={handleToggleLike}
            aria-label={
              isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"
            }
          >
            <Heart
              size={20}
              fill={isLiked ? "var(--error)" : "none"}
              stroke={isLiked ? "var(--error)" : "currentColor"}
              strokeWidth={2}
            />
          </button>
        </div>
      </header>

      {/* Asosiy kontent maydoni */}
      <main className={styles.mainContent}>
        {/* ============================================================
            1. HERO ASOSIY RASM (3/4 nisbatda, media_1790917535726.png):
            - 3/4 portret freymi, yirik radius
            - Silliq blur-up animatsiyasi bilan chiqadi
            - Variant bosilganda glass blur bilan mayin almashadi
            ============================================================ */}
        <section
          className={styles.heroImageSection}
          aria-label="Mahsulot fotosurati"
        >
          <div className={styles.mainImageFrame}>
            {product.badge && (
              <div className={styles.badgeWrapper}>
                <TicketBadge type={product.badge} />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, filter: "blur(14px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(14px)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={styles.motionImageWrapper}
              >
                <SmoothImage
                  src={images[activeImageIndex] || product.image}
                  alt={`${product.title} ko'rinishi ${activeImageIndex + 1}`}
                  className={styles.heroProductImage}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ============================================================
              2. PASTIDAGI 3 TA VARIANT (media_1790917535726.png):
              - 3 ta teng ustunli variant kartochkalari
              - Bosilganda yuqoridagi rasm glass blur bilan almashadi
              ============================================================ */}
          <div className={styles.variantsGrid}>
            {images.slice(0, 3).map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`${styles.variantCard} ${
                  idx === activeImageIndex ? styles.activeVariantCard : ""
                }`}
                aria-label={`${idx + 1}-rasm ko'rinishi`}
              >
                <img
                  src={imgSrc}
                  alt=""
                  className={styles.variantThumbImage}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. MAHSULOT NOMI VA NARXI (media_1790917535726.png):
            - Chapda: Mahsulot nomi
            - O'ngda: Narx (va chegirma bo'lsa eski narx)
            - Sharhlar va "1000% original" UMUMAN YO'Q
            - Muddatli to'lov sariq kapsulasi UMUMAN YO'Q
            ============================================================ */}
        <section className={styles.namePriceSection}>
          <div className={styles.namePriceRow}>
            <div className={styles.titleColumn}>
              <h2 className={styles.productHeading}>{product.title}</h2>
            </div>
            <div className={styles.priceColumn}>
              <span className={styles.currentPriceText}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className={styles.oldPriceText}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. TAVSIF (Description — media_1790917535726.png):
            - Sarlavha: Description / Tavsif
            - Matn va "Read more" / "Ko'proq o'qish" inline havolasi
            ============================================================ */}
        <section className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Tavsif</h3>
          <p
            className={`${styles.descriptionText} ${
              !isDescriptionExpanded ? styles.descriptionClamped : ""
            }`}
          >
            {product.fullDescription || product.description}
          </p>
          {(product.fullDescription || product.description)?.length > 120 && (
            <button
              type="button"
              className={styles.readMoreBtn}
              onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            >
              {isDescriptionExpanded ? "Kamroq" : "Ko'proq o'qish"}
            </button>
          )}
        </section>

        {/* ============================================================
            5. ASOSIY XUSUSIYATLARI (Specifications):
            - Nozik hairline ajratuvchilar bilan toza, hashamatli qatorlar
            - Ortiqcha qutilar va grid borderlari yo'q
            ============================================================ */}
        {product.specs && product.specs.length > 0 && (
          <section className={styles.specsSection}>
            <h3 className={styles.sectionTitle}>Asosiy xususiyatlari</h3>
            <div className={styles.specsList}>
              {product.specs.map((item, index) => (
                <div key={index} className={styles.specItemRow}>
                  <span className={styles.specLabel}>{item.label}</span>
                  <span className={styles.specValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            6. XIZMAT AFZALLIKLARI (Yetkazib berish va kafolat):
            - Arzon qutili grid EMAS, Apple / SSENSE darajasidagi toza
              minimalist gorizontal ishonch qatorlari
            ============================================================ */}
        <section className={styles.serviceSection}>
          <div className={styles.serviceRow}>
            <div className={styles.serviceIconPill}>
              <Truck size={17} strokeWidth={2} />
            </div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceHeading}>
                Yetkazib berish xizmati
              </span>
              <span className={styles.serviceDetail}>
                Ertagayoq butun O'zbekiston bo'ylab eshikkacha
              </span>
            </div>
          </div>

          <div className={styles.serviceRow}>
            <div className={styles.serviceIconPill}>
              <ShieldCheck size={17} strokeWidth={2} />
            </div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceHeading}>Rasmiy kafolat</span>
              <span className={styles.serviceDetail}>
                1 yil to'liq rasmiy servis va xizmat kafolati
              </span>
            </div>
          </div>

          <div className={styles.serviceRow}>
            <div className={styles.serviceIconPill}>
              <RotateCcw size={17} strokeWidth={2} />
            </div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceHeading}>Qulay qaytarish</span>
              <span className={styles.serviceDetail}>
                14 kun ichida tezkor almashtirish va qaytarish
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          7. PASTKI QOTIRILGAN TUGMALAR (TENG 50% / 50% BO'LINGAN!):
          - media_1790917535726.png dagi kabi:
            [ Add to cart 🛒 ] (50%)  |  [ Buy Now 🛍️ ] (50%)
          - Orasidagi masofa teng
          - Bosilganda bir xil yoyiluvchi (ripple) professional animatsiya
          - Hoverlarda mutlaqo scale yo'q
          ============================================================ */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          {/* Chapdagi 50% kenglikdagi Outline tugma: "Add to cart" / "Savatga" */}
          <button
            type="button"
            className={styles.cartBtn}
            onClick={handleAddToCart}
            aria-label="Savatga qo'shish"
          >
            <span className={styles.btnLabel}>
              {quantity > 0 ? `Savatda (${quantity})` : "Savatga"}
            </span>
            <ShoppingCart size={17} strokeWidth={2} />
            {cartRipples.map((ripple) => (
              <span
                key={ripple.id}
                className={styles.unifiedRipple}
                style={{
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                }}
              />
            ))}
          </button>

          {/* O'ngdagi 50% kenglikdagi Filled Primary tugma: "Buy Now" / "Rasmiylashtirish" */}
          <button
            type="button"
            className={styles.buyNowBtn}
            onClick={handleCheckout}
            aria-label="Rasmiylashtirish"
          >
            <span className={styles.btnLabel}>Rasmiylashtirish</span>
            <ShoppingBag size={17} strokeWidth={2} />
            {checkoutRipples.map((ripple) => (
              <span
                key={ripple.id}
                className={styles.unifiedRippleWhite}
                style={{
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                }}
              />
            ))}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
