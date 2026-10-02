import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import TicketBadge from "../../components/products/TicketBadge";
import SmoothImage from "../../components/common/SmoothImage";
import NotificationBadge from "../../components/common/NotificationBadge";
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
    totalLikedCount,
    totalCartCount,
    showToast,
  } = useApp();

  const quantity = product ? getCartQuantity(product.id) : 0;
  const isLiked = product ? checkIsLiked(product.id) : false;

  // Rasmlar galereyasi (admin panel orqali bir nechta rasm qo'shish imkoniyatiga to'liq moslashgan)
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [btnRipples, setBtnRipples] = useState([]);
  const [decRipples, setDecRipples] = useState([]);
  const [incRipples, setIncRipples] = useState([]);
  const [checkoutRipples, setCheckoutRipples] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const rippleCounter = useRef(0);

  // Mahsulot o'zgarganda birinchi rasmga qaytarish (React render-time adjustment)
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (product?.id !== prevProductId) {
    setPrevProductId(product?.id);
    setActiveImageIndex(0);
  }

  // Sahifa boshiga silliq ko'chirish
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

  // Ripple effekti yaratish funksiyasi
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

  // Savatga birinchi marta qo'shish
  const handleInitialAddToCart = (e) => {
    if (isAdding || quantity > 0) return;
    createRipple(e, setBtnRipples);
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product.id);
      setIsAdding(false);
    }, 280);
  };

  // Savatdan bittaga kamaytirish
  const handleDecrement = (e) => {
    createRipple(e, setDecRipples);
    updateCartQuantity(product.id, -1);
  };

  // Savatga bittaga oshirish
  const handleIncrement = (e) => {
    createRipple(e, setIncRipples);
    updateCartQuantity(product.id, 1);
  };

  // Like tugmasi
  const handleToggleLike = (e) => {
    e.stopPropagation();
    handleToggleLikeContext(product.id);
  };

  // Rasmiylashtirish tugmasi (hozircha hech narsa bajarmaydi, foydalanuvchi talabiga asosan)
  const handleCheckout = (e) => {
    createRipple(e, setCheckoutRipples);
    // Hozircha hech nima bo'lmaydi
  };

  // Havola nusxalash
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        showToast("Havola nusxalandi");
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  // Chegirma foizini hisoblash
  const discountPercent =
    product.oldPrice && product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : null;

  // Swipe / Drag o'ng va chapga surish hodisasi
  const handleDragEnd = (_, info) => {
    const threshold = 40;
    if (info.offset.x < -threshold && activeImageIndex < images.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ============================================================
          TOP HEADER:
          - Chapda: Ortga qaytish (Back) tugmasi
          - Qidiruv maydoni UMUMAN YO'Q
          - O'ngda: Like va Savatcha tugmalari (Badge ko'rsatkichlari bilan)
          ============================================================ */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Ortga qaytish tugmasi */}
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={onBack}
            aria-label="Ortga qaytish"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          {/* Sarlavha / Logo o'rnidagi ixcham brend yozuvi */}
          <div className={styles.headerTitleContainer}>
            <span className={styles.headerProductTitle}>{product.title}</span>
          </div>

          {/* O'ng tarafdagi harakatlar: Ulashish, Like va Savatcha */}
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerIconBtn}
              onClick={handleShare}
              aria-label="Mahsulotni ulashish"
            >
              <Share2 size={20} strokeWidth={1.8} />
              {copiedLink && <span className={styles.shareTooltip}>Nusxalandi</span>}
            </button>

            <button
              type="button"
              className={`${styles.headerIconBtn} ${isLiked ? styles.headerLiked : ""}`}
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
              <NotificationBadge
                count={totalLikedCount}
                className={styles.headerBadge}
              />
            </button>

            <button
              type="button"
              className={styles.headerIconBtn}
              onClick={handleInitialAddToCart}
              aria-label="Savatcha"
            >
              <ShoppingCart size={22} strokeWidth={1.8} />
              <NotificationBadge
                count={totalCartCount}
                className={styles.headerBadge}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Asosiy kontent maydoni */}
      <main className={styles.mainContent}>
        {/* ============================================================
            HERO RASMLAR KARUSELI (APPLE / PRO E-COMMERCE STANDARTIDA):
            - Katta, kristaldek tiniq rasm
            - Swipe / Touch drag
            - Admin panel qo'shadigan bir nechta rasmlar qo'llab-quvvatlovi
            - Zamonaviy Dark Glass pill ko'rsatkichi (masalan: 1 / 3)
            - Kichik thumbnail previewlar (agar bir nechta rasm bo'lsa)
            ============================================================ */}
        <section
          className={styles.gallerySection}
          aria-label="Mahsulot rasmlari galereyasi"
        >
          <div className={styles.carouselContainer}>
            {/* 3D Ticket Badge (Aksiya / Yangi) */}
            {product.badge && (
              <div className={styles.badgeWrapper}>
                <TicketBadge type={product.badge} />
              </div>
            )}

            {/* Drag / Touch Swipe rasm slayd qatlami */}
            <div className={styles.carouselSlider}>
              <motion.div
                className={styles.sliderTrack}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={{ x: `-${activeImageIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {images.map((imgSrc, idx) => (
                  <div key={idx} className={styles.slideItem}>
                    <SmoothImage
                      src={imgSrc}
                      alt={`${product.title} - ${idx + 1}`}
                      className={styles.carouselImage}
                      draggable={false}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Raqamli Dark Glass Capsule (1 / 3) */}
            {images.length > 1 && (
              <div className={styles.imageCounterCapsule}>
                <span>{activeImageIndex + 1}</span>
                <span className={styles.counterDivider}>/</span>
                <span>{images.length}</span>
              </div>
            )}
          </div>

          {/* Silliq indikator nuqtalari (Dots) */}
          {images.length > 1 && (
            <div className={styles.dotsContainer}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${styles.dot} ${
                    idx === activeImageIndex ? styles.activeDot : ""
                  }`}
                  aria-label={`${idx + 1}-rasmga o'tish`}
                />
              ))}
            </div>
          )}

          {/* Mini Thumbnail chiziqchasi (foydalanuvchi bitta bosishda boshqa burchakdagi rasmga o'tishi uchun) */}
          {images.length > 1 && (
            <div className={styles.thumbnailStrip}>
              {images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${styles.thumbBtn} ${
                    idx === activeImageIndex ? styles.activeThumb : ""
                  }`}
                  aria-label={`${idx + 1}-rasm miniatyurasi`}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    className={styles.thumbImage}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================
            MAHSULOT ASOSIY MA'LUMOTLARI:
            - Narxlar bloki: Katta joriy narx, eski narx, chegirma foizi
            - Bo'lib to'lash kapsulasi (Installment capsule)
            - Mahsulot nomi (Katta, qimmat typography)
            - Reyting va original sifat kafolati nishoni
            ============================================================ */}
        <section className={styles.infoSection}>
          {/* Narxlar bloki */}
          <div className={styles.priceRow}>
            <div className={styles.currentPrice}>
              {formatPrice(product.price)}
            </div>

            {product.oldPrice && (
              <div className={styles.oldPriceGroup}>
                <span className={styles.oldPrice}>
                  {formatPrice(product.oldPrice)}
                </span>
                {discountPercent && (
                  <span className={styles.discountPill}>
                    ↓{discountPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sariq muddatli to'lov kapsulasi */}
          {product.monthlyPrice && (
            <div className={styles.installmentCapsule}>
              <span className={styles.installmentPrefix}>Muddatli to'lov:</span>
              <span className={styles.installmentHighlight}>
                {product.monthlyPrice} so'mdan
              </span>
              <span className={styles.installmentDuration}>/ 12 oy</span>
            </div>
          )}

          {/* Katta va hashamatli sarlavha */}
          <h1 className={styles.productMainTitle}>{product.title}</h1>

          {/* Reyting va ishonchli do'kon statusi */}
          <div className={styles.metaRow}>
            <div className={styles.ratingBox}>
              <Star
                size={15}
                fill="var(--warning)"
                stroke="var(--warning)"
                className={styles.starIcon}
              />
              <span className={styles.ratingScore}>
                {product.rating || "4.9"}
              </span>
              <span className={styles.reviewsCount}>
                ({product.reviews || 120} ta sharh)
              </span>
            </div>

            <div className={styles.verifiedBadge}>
              <CheckCircle2 size={14} className={styles.verifiedIcon} />
              <span>100% Original</span>
            </div>
          </div>
        </section>

        {/* ============================================================
            AFZALLIKLAR VA ISHONCH KAFOLATLARI (PREMIUM ICONLAR BILAN):
            1. Tezkor yetkazib berish (1 kun)
            2. 1 yil rasmiy kafolat
            3. 14 kun ichida almashtirish va qaytarish
            4. Xavfsiz to'lov va qulaylik
            ============================================================ */}
        <section
          className={styles.perksSection}
          aria-label="Xizmat afzalliklari"
        >
          <div className={styles.perksGrid}>
            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Truck size={20} strokeWidth={2} />
              </div>
              <div className={styles.perkText}>
                <h4 className={styles.perkTitle}>Tezkor yetkazib berish</h4>
                <p className={styles.perkSubtitle}>
                  1 kunda O'zbekiston bo'ylab eshikkacha
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div className={styles.perkText}>
                <h4 className={styles.perkTitle}>1 yil rasmiy kafolat</h4>
                <p className={styles.perkSubtitle}>
                  Asl ishlab chiqaruvchi servis markazlarida
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <RotateCcw size={20} strokeWidth={2} />
              </div>
              <div className={styles.perkText}>
                <h4 className={styles.perkTitle}>14 kun qaytarish</h4>
                <p className={styles.perkSubtitle}>
                  Mahsulot ma'qul kelmasa, oson almashtirish
                </p>
              </div>
            </div>

            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <Sparkles size={20} strokeWidth={2} />
              </div>
              <div className={styles.perkText}>
                <h4 className={styles.perkTitle}>Halol muddatli to'lov</h4>
                <p className={styles.perkSubtitle}>
                  Boshlang'ich to'lovsiz, 12 oygacha bo'lib to'lash
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            MAHSULOTNING TO'LIQ TAVSIFI (Chuqur o'ylangan professional matn)
            ============================================================ */}
        <section
          className={styles.descriptionSection}
          aria-label="Mahsulot tavsifi"
        >
          <h2 className={styles.sectionHeaderTitle}>Mahsulot haqida</h2>
          <p className={styles.descriptionText}>
            {product.fullDescription || product.description}
          </p>
        </section>

        {/* ============================================================
            ASOSIY TEXNIK XUSUSIYATLAR (SPECS JADVALI):
            Clean luxury Apple / Uzum formatidagi 2 ustunli ro'yxat
            ============================================================ */}
        {product.specs && product.specs.length > 0 && (
          <section
            className={styles.specsSection}
            aria-label="Mahsulot xususiyatlari"
          >
            <h2 className={styles.sectionHeaderTitle}>Asosiy xususiyatlari</h2>
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
      </main>

      {/* ============================================================
          BOTTOM STICKY ACTION BAR (PINS TO BOTTOM):
          - Chap tomonda: Savatga qo'shish yoki miqdor Stepper boshqaruvi
            (Xuddi ProductCard uslubida: [-] count [+])
          - O'ng tomonda: "Rasmiylashtirish" birlamchi CTA tugmasi
          - Hover/Active animatsiyalari professional: scale yo'q, silliq ripple mavjud
          ============================================================ */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          {/* Chap boshqaruv: Stepper yoki Savatga tugmasi */}
          <div className={styles.cartActionArea}>
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
                  <Minus size={17} strokeWidth={2.4} />
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
                  <Plus size={17} strokeWidth={2.4} />
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
                className={`${styles.addToCartBtn} ${
                  isAdding ? styles.loadingBtn : ""
                }`}
                onClick={handleInitialAddToCart}
                disabled={isAdding}
                aria-label="Savatga qo'shish"
              >
                {isAdding ? (
                  <span className={styles.btnSpinner} />
                ) : (
                  <>
                    <ShoppingCart size={18} strokeWidth={2} />
                    <span>Savatga</span>
                  </>
                )}
                {btnRipples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className={styles.buttonRipple}
                    style={{
                      left: `${ripple.x}px`,
                      top: `${ripple.y}px`,
                    }}
                  />
                ))}
              </button>
            )}
          </div>

          {/* O'ng boshqaruv: Rasmiylashtirish tugmasi */}
          <button
            type="button"
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            aria-label="Rasmiylashtirish"
          >
            <span>Rasmiylashtirish</span>
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
