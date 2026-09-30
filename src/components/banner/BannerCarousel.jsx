import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import bannerImg from "../../assets/images/banner.png";
import styles from "./bannerCarousel.module.css";

const baseBanners = [
  {
    id: 1,
    image: bannerImg,
    productId: "sony-camera-a7",
    link: "/product/sony-camera-a7",
    alt: "Sony Alpha Maxsus Aksiya",
  },
  {
    id: 2,
    image: bannerImg,
    productId: "sony-lens-master",
    link: "/product/sony-lens-master",
    alt: "Professional Obektivlar",
  },
  {
    id: 3,
    image: bannerImg,
    productId: "camera-accessories",
    link: "/product/camera-accessories",
    alt: "Fototexnika Aksessuarlari",
  },
];

const L = baseBanners.length; // 3 ta banner

const BannerCarousel = ({ isActive = true, onBannerClick }) => {
  // Uzluksiz virtual indeks (0, 1, 2, 3, ...) — cheksiz aylanadi
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(340);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [ripples, setRipples] = useState([]);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const autoplayTimer = useRef(null);
  const rippleCounter = useRef(0);

  // Motion qiymati
  const x = useMotionValue(0);

  // Cardlar orasidagi masofa
  const gap = 16;

  // Ekran o'lchamini hisoblash
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const cWidth = containerRef.current.offsetWidth;
      if (cWidth > 0) {
        setContainerWidth(cWidth);
        const calculatedWidth = Math.min(Math.round(cWidth * 0.85), 940);
        setSlideWidth(calculatedWidth);
      }
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Sahifa qayta faol bo'lganda o'lchamni yangilash
  useEffect(() => {
    if (isActive) {
      updateDimensions();
    }
  }, [isActive, updateDimensions]);

  // Card balandligi (984 / 323 proporsiyasi bo'yicha)
  const slideHeight = Math.round(slideWidth * (323 / 984));

  // Markazga mos keluvchi koordinata
  const getTargetX = useCallback(
    (index) => {
      const centerOffset = (containerWidth - slideWidth) / 2;
      return centerOffset - index * (slideWidth + gap);
    },
    [containerWidth, slideWidth, gap],
  );

  // Har safar currentIndex o'zgarganda (avtomatik yoki dot bosilganda) x koordinatasini mayin, sakrashlarsiz animatsiya qilish
  useEffect(() => {
    if (containerWidth > 0 && !isDragging.current && isActive) {
      const target = getTargetX(currentIndex);
      animate(x, target, {
        type: "spring",
        stiffness: 115,
        damping: 18,
        mass: 0.85,
      });
    }
  }, [currentIndex, getTargetX, containerWidth, x, isActive]);

  // Keyingi card
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Oldingi card
  const _prevSlide = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // 4.5 soniyalik autoplay (faqat sahifa ko'rinib turganda va pauza bo'lmaganda)
  useEffect(() => {
    if (isPaused || !isActive) return;

    autoplayTimer.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [nextSlide, isPaused, isActive]);

  // Drag boshlanishi
  const handleDragStart = () => {
    isDragging.current = true;
    dragDistance.current = 0;
    setIsPaused(true);
    x.stop(); // Oldingi har qanday animatsiyani to'xtatish
  };

  // Drag jarayoni
  const handleDrag = (e, info) => {
    dragDistance.current = Math.abs(info.offset.x);
  };

  // Drag tugashi — dragMomentum={false} bilan mayin bahoriy snap
  const handleDragEnd = (e, info) => {
    setIsPaused(false);
    isDragging.current = false;
    x.stop();

    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 45;
    const velocityThreshold = 250;

    let targetIndex = currentIndex;
    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      targetIndex = currentIndex + 1;
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      targetIndex = currentIndex - 1;
    }

    // Yangi target koordinatasi
    const target = getTargetX(targetIndex);
    animate(x, target, {
      type: "spring",
      stiffness: 130,
      damping: 20,
      mass: 0.8,
      velocity: info.velocity.x,
    });

    if (targetIndex !== currentIndex) {
      setCurrentIndex(targetIndex);
    }
  };

  // iOS-style to'lqin (ripple) effekti — transform siz, sayoz nur tarqalishi
  const handleCardPointerDown = (e, cardIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX ||
        (e.touches && e.touches[0].clientX) ||
        rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY ||
        (e.touches && e.touches[0].clientY) ||
        rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;

    const newRipple = {
      id: rippleId,
      cardIndex,
      x: rippleX,
      y: rippleY,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  // Card bosilganda mahsulotga/qidiruvga o'tish (faqat surilmagan bo'lsa)
  const handleCardClick = (bannerData) => {
    if (dragDistance.current < 6) {
      if (onBannerClick) {
        onBannerClick(bannerData.alt || "Sony");
      } else if (bannerData.link) {
        window.location.assign(bannerData.link);
      }
    }
  };

  // Faol nuqta (0, 1, 2)
  const activeDotIndex = ((currentIndex % L) + L) % L;

  // Nuqta bosilganda aylanadagi eng yaqin yo'l bo'ylab siljish (sakrab ketmaslik uchun)
  const handleDotClick = (targetDotIndex) => {
    let diff = targetDotIndex - activeDotIndex;
    if (diff > L / 2) {
      diff -= L;
    } else if (diff < -L / 2) {
      diff += L;
    }
    setCurrentIndex((prev) => prev + diff);
  };

  // Ekranda ko'rinuvchi 7 ta virtual card (cheksiz aylanma doira)
  const visibleIndices = [
    currentIndex - 3,
    currentIndex - 2,
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
    currentIndex + 3,
  ];

  return (
    <section
      className={styles.bannerSection}
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-label="Aksiya va takliflar"
    >
      <div className={styles.carouselViewport}>
        <motion.div
          className={styles.track}
          style={{ x, height: `${slideHeight}px` }}
          drag="x"
          dragConstraints={{ left: -100000, right: 100000 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {visibleIndices.map((virtualIndex) => {
            const bannerData = baseBanners[((virtualIndex % L) + L) % L];
            const isCenter = virtualIndex === currentIndex;
            const cardRipples = ripples.filter(
              (r) => r.cardIndex === virtualIndex,
            );

            return (
              <div
                key={virtualIndex}
                className={`${styles.slideCard} ${
                  isCenter ? styles.centerCard : styles.sideCard
                }`}
                style={{
                  left: `${virtualIndex * (slideWidth + gap)}px`,
                  width: `${slideWidth}px`,
                  height: `${slideHeight}px`,
                }}
                onPointerDown={(e) => handleCardPointerDown(e, virtualIndex)}
                onClick={() => handleCardClick(bannerData)}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={bannerData.alt}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={bannerData.image}
                    alt={bannerData.alt}
                    className={styles.bannerImage}
                    draggable={false}
                  />

                  {/* iOS uslubidagi mayin to'lqin (ripple) effekti */}
                  {cardRipples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className={styles.ripple}
                      style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                      }}
                    />
                  ))}

                  {/* Bosilgandagi mayin nur yoyilishi (sayoz flash) */}
                  <div className={styles.pressHighlight} />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Minimalist pagination nuqtalari */}
      <div className={styles.pagination}>
        {baseBanners.map((_, dotIdx) => {
          const isActiveDot = dotIdx === activeDotIndex;
          return (
            <button
              key={dotIdx}
              type="button"
              className={`${styles.dot} ${isActiveDot ? styles.activeDot : ""}`}
              onClick={() => handleDotClick(dotIdx)}
              aria-label={`Banner ${dotIdx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default BannerCarousel;
