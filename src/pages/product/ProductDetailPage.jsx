import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Camera,
  BatteryCharging,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmoothImage from "../../components/common/SmoothImage";
import { formatPrice } from "../../data/products";
import { useApp } from "../../context/useApp";
import styles from "./productDetailPage.module.css";

const ProductDetailPage = ({ product, onBack }) => {
  const {
    getCartQuantity,
    addToCart,
    updateCartQuantity,
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
  const [decRipples, setDecRipples] = useState([]);
  const [incRipples, setIncRipples] = useState([]);
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

  // Radial gradient suv to'lqini (Ripple) yaratish
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
    }, 550);
  };

  // Stepper kamaytirish (-)
  const handleDecrement = (e) => {
    createRipple(e, setDecRipples);
    if (quantity > 0) {
      updateCartQuantity(product.id, -1);
    }
  };

  // Stepper oshirish (+)
  const handleIncrement = (e) => {
    createRipple(e, setIncRipples);
    if (quantity === 0) {
      addToCart(product.id);
    } else {
      updateCartQuantity(product.id, 1);
    }
  };

  // Rasmiylashtirish tugmasi (talabga binoan no-op)
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
          TOP HEADER:
          - Boshqa sahifalar (Search & Home) bilan 1-ga 1 mos
          - Chapda: Ortga qaytish (<) tugmasi (transparent fon, hoverda surface-subtle)
          - O'rtada: Mahsulot nomi (Product Title)
          - O'ngda: Faqatgina Like (Heart) tugmasi (transparent fon, hoverda surface-subtle)
          ============================================================ */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Ortga qaytish tugmasi */}
          <button
            type="button"
            className={styles.headerBtn}
            onClick={onBack}
            aria-label="Ortga qaytish"
          >
            <ChevronLeft size={22} strokeWidth={1.8} />
          </button>

          {/* O'rtadagi sarlavha */}
          <div className={styles.headerTitleBox}>
            <h1 className={styles.headerTitle}>{product.title}</h1>
          </div>

          {/* O'ngdagi faqat Like tugmasi */}
          <button
            type="button"
            className={`${styles.headerBtn} ${isLiked ? styles.likedBtn : ""}`}
            onClick={handleToggleLike}
            aria-label={
              isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"
            }
          >
            <Heart
              size={22}
              fill={isLiked ? "var(--error)" : "none"}
              stroke={isLiked ? "var(--error)" : "currentColor"}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </header>

      {/* Asosiy kontent maydoni */}
      <main className={styles.mainContent}>
        {/* ============================================================
            1. HERO ASOSIY RASM (3/4 NISBATDA):
            - 3/4 aspect ratio, 1px solid var(--border)
            - Rasm ichida badge umuman bo'lmaydi
            - Variant bosilganda glass blur bilan mayin almashadi
            ============================================================ */}
        <section
          className={styles.heroImageSection}
          aria-label="Mahsulot fotosurati"
        >
          <div className={styles.mainImageFrame}>
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
              2. PASTIDAGI 3 TA VARIANT:
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
            3. AKSIYA / YANGI BADGE (RASMLAR PASTIDA CHIROYLI UI ELEMENT):
            ============================================================ */}
        {product.badge && (
          <div className={styles.badgeRow}>
            {product.badge === "aksiya" ? (
              <span className={styles.badgeSale}>
                <Sparkles size={12} strokeWidth={2.4} />
                <span>Maxsus aksiya</span>
              </span>
            ) : (
              <span className={styles.badgeNew}>
                <Sparkles size={12} strokeWidth={2.4} />
                <span>Yangi model</span>
              </span>
            )}
          </div>
        )}

        {/* ============================================================
            4. MAHSULOT NOMI VA NARXI:
            - Chapda: Mahsulot nomi
            - O'ngda: Narx va eski narx
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
            5. TAVSIF VA AFZALLIKLAR (EKSPERT DARAJASIDAGI VIZUAL PRESENTATSIYA):
            - Monoton zerikarli emas, vizual highlight kartochkalari bilan boyitilgan
            ============================================================ */}
        <section className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Mahsulot tavsifi</h3>
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
              {isDescriptionExpanded ? "Kamroq ko'rsatish" : "To'liq tavsifni o'qish"}
            </button>
          )}

          {/* Ekspert xususiyatlar bloklari (Vizual highlight kartochkalari) */}
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIconBox}>
                <Zap size={16} strokeWidth={2.2} />
              </div>
              <div className={styles.highlightInfo}>
                <span className={styles.highlightTitle}>Tezkor va unumdor</span>
                <span className={styles.highlightDesc}>
                  Eng so'nggi texnologik chiplar bilan yuqori tezlik
                </span>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIconBox}>
                <Camera size={16} strokeWidth={2.2} />
              </div>
              <div className={styles.highlightInfo}>
                <span className={styles.highlightTitle}>Professional sifat</span>
                <span className={styles.highlightDesc}>
                  Har qanday sharoitda eng yuqori aniqlik va tiniqlik
                </span>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIconBox}>
                <BatteryCharging size={16} strokeWidth={2.2} />
              </div>
              <div className={styles.highlightInfo}>
                <span className={styles.highlightTitle}>Butun kunlik quvvat</span>
                <span className={styles.highlightDesc}>
                  Energiya tejamkor akkumulyator bilan uzoq ish faoliyati
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. ASOSIY XUSUSIYATLARI (Specifications):
            - 1px solid var(--border) chegara bilan toza texnik jadval
            ============================================================ */}
        {product.specs && product.specs.length > 0 && (
          <section className={styles.specsSection}>
            <h3 className={styles.sectionTitle}>Asosiy xususiyatlari</h3>
            <div className={styles.specsTable}>
              {product.specs.map((item, index) => (
                <div key={index} className={styles.specRow}>
                  <span className={styles.specLabel}>{item.label}</span>
                  <span className={styles.specValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            7. XIZMAT VA ISHONCH KAFOLATLARI (10K$ NATIVE APP FORMATIDA):
            - Yagona toza hoshiyali konteyner, micro-pill nishonlar
            ============================================================ */}
        <section className={styles.serviceCardContainer}>
          <div className={styles.serviceCardRow}>
            <div className={`${styles.serviceIconPill} ${styles.serviceIconDelivery}`}>
              <Truck size={18} strokeWidth={2} />
            </div>
            <div className={styles.serviceTextGroup}>
              <span className={styles.serviceTitle}>Yetkazib berish xizmati</span>
              <span className={styles.serviceDesc}>
                Ertagayoq butun O'zbekiston bo'ylab eshikkacha
              </span>
            </div>
            <span className={styles.serviceStatusPill}>Bepul</span>
          </div>

          <div className={styles.serviceCardRow}>
            <div className={`${styles.serviceIconPill} ${styles.serviceIconWarranty}`}>
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <div className={styles.serviceTextGroup}>
              <span className={styles.serviceTitle}>1 yil rasmiy kafolat</span>
              <span className={styles.serviceDesc}>
                Ishlab chiqaruvchi servis markazlarida bepul xizmat
              </span>
            </div>
            <span className={styles.serviceStatusPill}>Original</span>
          </div>

          <div className={styles.serviceCardRow}>
            <div className={`${styles.serviceIconPill} ${styles.serviceIconReturn}`}>
              <RotateCcw size={18} strokeWidth={2} />
            </div>
            <div className={styles.serviceTextGroup}>
              <span className={styles.serviceTitle}>14 kun qaytarish kafolati</span>
              <span className={styles.serviceDesc}>
                Mahsulot ma'qul kelmasa, tezkor va oson almashtirish
              </span>
            </div>
            <span className={styles.serviceStatusPill}>Oson</span>
          </div>
        </section>
      </main>

      {/* ============================================================
          8. PASTKI QOTIRILGAN TUGMALAR (TENG 50% / 50%):
          - Chapda: Home card dagi count stepper button bilan 1-ga 1 mos (50%)
          - O'ngda: Home card dagi savatga button bilan 1-ga 1 mos (50%)
          - Bosilganda radial suv to'lqini (Ripple) effekti
          - Hover/Active va radiuslari to'liq sayt bilan uyg'un
          ============================================================ */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          {/* Chapdagi 50% boshqaruv: Home Card count stepper button bilan 1-ga 1 mos */}
          <div className={styles.stepperWrapper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={handleDecrement}
              disabled={quantity === 0}
              aria-label="Bir dona kamaytirish"
            >
              <Minus size={15} strokeWidth={2.4} />
              {decRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className={styles.stepperRipple}
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                  }}
                />
              ))}
            </button>

            <span className={styles.stepperCount} aria-live="polite">
              {quantity}
            </span>

            <button
              type="button"
              className={styles.stepperBtn}
              onClick={handleIncrement}
              aria-label="Bir dona oshirish"
            >
              <Plus size={15} strokeWidth={2.4} />
              {incRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className={styles.stepperRipple}
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                  }}
                />
              ))}
            </button>
          </div>

          {/* O'ngdagi 50% boshqaruv: Home Card dagi savatga button style bilan 1-ga 1 mos */}
          <button
            type="button"
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            aria-label="Rasmiylashtirish"
          >
            <ShoppingBag size={16} strokeWidth={2} />
            <span className={styles.checkoutBtnLabel}>Rasmiylashtirish</span>
            {checkoutRipples.map((ripple) => (
              <span
                key={ripple.id}
                className={styles.checkoutRipple}
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
