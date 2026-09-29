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
  // Uzluksiz virtual indeks (0, 1, 2, 3, ...) — orqaga qaytmaydi, cheksiz aylanadi
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(340);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [ripples, setRipples] = useState([]);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const pointerStartX = useRef(0);
  const autoplayTimer = useRef(null);
  const rippleCounter = useRef(0);

  // Motion qiymati
  const x = useMotionValue(0);

  // Cardlar orasidagi masofa
  const gap = 16;

  // Ekran o'lchamini hisoblash
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const cWidth = containerRef.current.offsetWidth || window.innerWidth;
      if (cWidth > 0) {
        setContainerWidth(cWidth);
        const calculatedWidth = Math.min(Math.round(cWidth * 0.85), 940);
        setSlideWidth(calculatedWidth);
        return { cWidth, calculatedWidth };
      }
    }
    return null;
  }, []);

  // Markazga mos keluvchi koordinata
  const getTargetX = useCallback(
    (index, cWidth = containerWidth, sWidth = slideWidth) => {
      const validCWidth = cWidth > 0 ? cWidth : (containerRef.current?.offsetWidth || window.innerWidth);
      const validSWidth = sWidth > 0 ? sWidth : Math.min(Math.round(validCWidth * 0.85), 940);
      const centerOffset = (validCWidth - validSWidth) / 2;
      return centerOffset - index * (validSWidth + gap);
    },
    [containerWidth, slideWidth, gap]
  );

  // ResizeObserver va Window resize hodisalari
  useEffect(() => {
    const res = updateDimensions();
    if (res) {
      const centerOffset = (res.cWidth - res.calculatedWidth) / 2;
      x.set(centerOffset - currentIndex * (res.calculatedWidth + gap));
    }

    const handleResize = () => {
      const r = updateDimensions();
      if (r) {
        const centerOffset = (r.cWidth - r.calculatedWidth) / 2;
        x.set(centerOffset - currentIndex * (r.calculatedWidth + gap));
      }
    };

    window.addEventListener("resize", handleResize);

    // ResizeObserver: display: none dan display: block ga o'tganda darhol qayta hisoblash
    let ro;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) {
            setContainerWidth(w);
            const calcW = Math.min(Math.round(w * 0.85), 940);
            setSlideWidth(calcW);
            const centerOffset = (w - calcW) / 2;
            const target = centerOffset - currentIndex * (calcW + gap);
            x.set(target);
          }
        }
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ro) ro.disconnect();
    };
  }, [updateDimensions, currentIndex, gap, x]);

  // isActive o'zgarganda (Search'dan Home'ga qaytilganda) darhol va sakrashlarsiz sinxronlash
  useEffect(() => {
    if (isActive && containerRef.current) {
      const w = containerRef.current.offsetWidth || window.innerWidth;
      if (w > 0) {
        setContainerWidth(w);
        const calcW = Math.min(Math.round(w * 0.85), 940);
        setSlideWidth(calcW);
        const centerOffset = (w - calcW) / 2;
        const target = centerOffset - currentIndex * (calcW + gap);
        x.set(target);
      }
    }
  }, [isActive, currentIndex, gap, x]);

  // Har safar currentIndex o'zgarganda x koordinatasini mayin, sakrashlarsiz animatsiya qilish
  useEffect(() => {
    if (containerWidth > 0 && isActive) {
      const target = getTargetX(currentIndex);
      animate(x, target, {
        type: "spring",
        stiffness: 125,
        damping: 20,
        mass: 0.9,
      });
    }
  }, [currentIndex, getTargetX, containerWidth, x, isActive]);

  // Keyingi card
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Oldingi card
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // 5 soniyalik autoplay (faqat sahifa faol va ko'rinib turganda ishlaydi)
  useEffect(() => {
    if (isPaused || !isActive) return;

    autoplayTimer.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [nextSlide, isPaused, isActive]);

  // Drag boshlanishi (to'g'ridan-to'g'ri card ustiga bosilganda ham ishlaydi)
  const handleDragStart = (e) => {
    isDragging.current = true;
    dragDistance.current = 0;
    pointerStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setIsPaused(true);
  };

  // Drag jarayoni
  const handleDrag = (e, info) => {
    dragDistance.current = Math.abs(info.offset.x);
  };

  // Drag tugashi
  const handleDragEnd = (e, info) => {
    setIsPaused(false);
    isDragging.current = false;

    const swipeThreshold = 40;
    const velocityThreshold = 200;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      prevSlide();
    } else {
      // O'z o'rniga mayin qaytish
      const target = getTargetX(currentIndex);
      animate(x, target, {
        type: "spring",
        stiffness: 140,
        damping: 20,
      });
    }
  };

  // iOS-style to'lqin (ripple) effekti — transform siz, sayoz nur tarqalishi
  const handleCardPointerDown = (e, cardIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2) - rect.left;
    const rippleY = (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height / 2) - rect.top;

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
  const handleCardClick = (banner) => {
    if (dragDistance.current < 6) {
      if (onBannerClick) {
        onBannerClick(banner.alt || "Sony");
      }
    }
  };

  // Faol nuqta (0, 1, 2)
  const activeDotIndex = ((currentIndex % L) + L) % L;

  // Ekranda ko'rinuvchi 5 ta virtual card
  const visibleIndices = [
    currentIndex - 2,
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
  ];

  // Card balandligi (984 / 323 proporsiyasi bo'yicha)
  const slideHeight = Math.round(slideWidth * (323 / 984));

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
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {visibleIndices.map((virtualIndex) => {
            const bannerData = baseBanners[((virtualIndex % L) + L) % L];
            const isCenter = virtualIndex === currentIndex;
            const cardRipples = ripples.filter((r) => r.cardIndex === virtualIndex);

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
              onClick={() => {
                const diff = dotIdx - activeDotIndex;
                setCurrentIndex((prev) => prev + diff);
              }}
              aria-label={`Banner ${dotIdx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default BannerCarousel;
