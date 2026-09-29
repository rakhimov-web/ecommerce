import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import ProductGrid from "../../components/products/ProductGrid";
import Menu from "../../components/menu/Menu";
import BannerSkeleton from "../../components/skeleton/BannerSkeleton";
import CategorySkeleton from "../../components/skeleton/CategorySkeleton";
import ProductGridSkeleton from "../../components/skeleton/ProductGridSkeleton";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sahifa ochilganda yoki yangilanganda ma'lumotlar o'qib bo'linguncha
    // 1.2 soniyalik ultra-smooth shimmer skeleton loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ paddingTop: "68px", paddingBottom: "76px", minHeight: "100vh" }}>
      <Header />
      <main>
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
              <BannerCarousel />

              {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
              <CategoryGrid />

              {/* Tavsiya qilingan mahsulotlar (3/4 aspect ratio, 2 ustunli mobil panjara) */}
              <ProductGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Menu />
    </div>
  );
};

export default Home;
