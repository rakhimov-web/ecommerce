import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import ProductGrid from "../../components/products/ProductGrid";
import BannerSkeleton from "../../components/skeleton/BannerSkeleton";
import CategorySkeleton from "../../components/skeleton/CategorySkeleton";
import ProductGridSkeleton from "../../components/skeleton/ProductGridSkeleton";
import styles from "./home.module.css";

import bannerImg from "../../assets/images/banner.png";
import telefonImg from "../../assets/categories/telefon.png";
import noutbukImg from "../../assets/categories/noutbuk.png";
import ipadImg from "../../assets/categories/ipad.png";
import watchImg from "../../assets/categories/apple-watch.png";
import aksessuarlarImg from "../../assets/categories/aksessuarlar.png";
import prodIphone from "../../assets/products/prod_iphone.jpg";
import prodMacbook from "../../assets/products/prod_macbook.jpg";
import prodIpad from "../../assets/products/prod_ipad.jpg";
import prodWatch from "../../assets/products/prod_watch.jpg";
import prodAirpods from "../../assets/products/prod_airpods.jpg";

// Birinchi marta sayt ochilganda yuklanish bayrog'i (keyingi sahifalar almashishida skeleton takrorlanmaydi)
let hasLoadedHomeOnce = false;

const Home = ({ isActive = true, onSearchClick, onCategoryClick }) => {
  const [loading, setLoading] = useState(!hasLoadedHomeOnce);

  useEffect(() => {
    if (hasLoadedHomeOnce) {
      setLoading(false);
      return;
    }

    // Rasmlarni orqa fonda oldindan GPU xotirasiga dekodlab yuklash (pre-cache)
    const imagesToPreload = [
      bannerImg,
      telefonImg,
      noutbukImg,
      ipadImg,
      watchImg,
      aksessuarlarImg,
      prodIphone,
      prodMacbook,
      prodIpad,
      prodWatch,
      prodAirpods,
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });

    const timer = setTimeout(() => {
      hasLoadedHomeOnce = true;
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Header onSearchClick={onSearchClick} />
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {/* Banner Skeleton */}
              <BannerSkeleton />

              {/* Toifalar Skeleton */}
              <CategorySkeleton />

              {/* Mahsulotlar panjarasi Skeleton */}
              <ProductGridSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {/* Yuqori cheksiz banner */}
              <BannerCarousel
                isActive={isActive}
                onBannerClick={onCategoryClick}
              />

              {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
              <CategoryGrid onCategoryClick={onCategoryClick} />

              {/* Tavsiya qilingan mahsulotlar (1/1 kvadrat aspect ratio, 2 ustunli mobil panjara) */}
              <ProductGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
