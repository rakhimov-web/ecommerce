import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
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
  const [cartBtnRipples, setCartBtnRipples] = useState([]);
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

  // Native ilovadek silliq radial suv to'lqini (Ripple) yaratish
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

  // Savatga dastlabki qo'shish
  const handleInitialAdd = (e) => {
    createRipple(e, setCartBtnRipples);
    addToCart(product.id);
  };

  // Stepper kamaytirish (-)
  const handleDecrement = (e) => {
    e.stopPropagation();
    createRipple(e, setDecRipples);
    updateCartQuantity(product.id, -1);
  };

  // Stepper oshirish (+)
  const handleIncrement = (e) => {
    e.stopPropagation();
    createRipple(e, setIncRipples);
    updateCartQuantity(product.id, 1);
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
          TOP FIXED HEADER:
          - SearchPage va Home Header bilan 1-ga 1 mos
          - Chapda: Ortga qaytish (<) tugmasi (transparent fon, hoverda surface-subtle)
          - O'rtada: Mahsulot nomi (Product Title)
          - O'ngda: Faqatgina Like (Heart) tugmasi
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

          {/* O'ngdagi Like tugmasi */}
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
            1. HERO ASOSIY RASM (3/4 NISBATDA, media_1790917535726.png):
            - 3/4 portret nisbat, studiya foni
            - Silliq blur-up animatsiyasi bilan chiqadi
            - Variant bosilganda glass blur cross-fade bilan mayin almashadi
            ============================================================ */}
        <section
          className={styles.heroImageSection}
          aria-label="Mahsulot fotosurati"
        >
          <div className={styles.mainImageFrame}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
            3. AKSIYA / YANGI BADGE (RASMLAR PASTIDA CHIROYLI UI ELEMENT):
            ============================================================ */}
        {product.badge && (
          <div className={styles.badgeRow}>
            {product.badge === "aksiya" ? (
              <span className={styles.badgeSale}>Maxsus aksiya</span>
            ) : (
              <span className={styles.badgeNew}>Yangi model</span>
            )}
          </div>
        )}

        {/* ============================================================
            4. MAHSULOT NOMI VA NARXI (media_1790917535726.png):
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
            5. TAVSIF (Description — media_1790917535726.png):
            - Sarlavha: Tavsif
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
              {isDescriptionExpanded ? "Kamroq ko'rsatish" : "Ko'proq o'qish"}
            </button>
          )}
        </section>

        {/* ============================================================
            6. ASOSIY XUSUSIYATLARI (Specifications):
            - Native iOS uslubidagi toza texnik jadval
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
            7. XIZMAT VA KAFOLAT (10K$ NATIVE APP FORMATIDA):
            - Yagona toza hoshiyali konteyner, micro-status nishonlar
            ============================================================ */}
        <section className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Xizmat va kafolat</h3>
          <div className={styles.serviceCardContainer}>
            <div className={styles.serviceCardRow}>
              <div className={`${styles.serviceIconBox} ${styles.serviceIconDelivery}`}>
                <Truck size={17} strokeWidth={2} />
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
              <div className={`${styles.serviceIconBox} ${styles.serviceIconWarranty}`}>
                <ShieldCheck size={17} strokeWidth={2} />
              </div>
              <div className={styles.serviceTextGroup}>
                <span className={styles.serviceTitle}>1 yil rasmiy kafolat</span>
                <span className={styles.serviceDesc}>
                  Ishlab chiqaruvchi servis markazlarida to'liq xizmat
                </span>
              </div>
              <span className={styles.serviceStatusPill}>Original</span>
            </div>

            <div className={styles.serviceCardRow}>
              <div className={`${styles.serviceIconBox} ${styles.serviceIconReturn}`}>
                <RotateCcw size={17} strokeWidth={2} />
              </div>
              <div className={styles.serviceTextGroup}>
                <span className={styles.serviceTitle}>14 kun qaytarish kafolati</span>
                <span className={styles.serviceDesc}>
                  Mahsulot ma'qul kelmasa, tezkor va oson almashtirish
                </span>
              </div>
              <span className={styles.serviceStatusPill}>Oson</span>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          8. PASTKI QOTIRILGAN TUGMALAR (TENG 50% / 50% BO'LINGAN!):
          - media_1790917535726.png dagi kabi:
            [ Add to cart 🛒 ] (50%)  |  [ Buy Now 🛍️ ] (50%)
          - Savatda mahsulot bo'lsa: Card stepper [ - ] count [ + ] (50%)
          - Savatda mahsulot bo'lmasa: Outline Savatga pill tugmasi (50%)
          - O'ngda: Card savatga buttoni style da Rasmiylashtirish (50%)
          ============================================================ */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          {/* Chapdagi 50% boshqaruv: Stepper (agar savatda bo'lsa) yoki Savatga pill tugma */}
          {quantity > 0 ? (
            <div
              className={styles.stepperContainer}
              role="group"
              aria-label={`${product.title} miqdori`}
            >
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={handleDecrement}
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
          ) : (
            <button
              type="button"
              className={styles.addToCartOutlineBtn}
              onClick={handleInitialAdd}
              aria-label="Savatga qo'shish"
            >
              <span className={styles.btnLabel}>Savatga</span>
              <ShoppingCart size={17} strokeWidth={2} />
              {cartBtnRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className={styles.buttonRippleDark}
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                  }}
                />
              ))}
            </button>
          )}

          {/* O'ngdagi 50% boshqaruv: Card savatga tugmasi style dagi Rasmiylashtirish */}
          <button
            type="button"
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            aria-label="Rasmiylashtirish"
          >
            <span className={styles.btnLabel}>Rasmiylashtirish</span>
            <ShoppingBag size={17} strokeWidth={2} />
            {checkoutRipples.map((ripple) => (
              <span
                key={ripple.id}
                className={styles.buttonRippleWhite}
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
