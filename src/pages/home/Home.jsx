import { useState, useEffect, useCallback } from "react";
import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import ProductGrid from "../../components/products/ProductGrid";
import BannerSkeleton from "../../components/skeleton/BannerSkeleton";
import CategorySkeleton from "../../components/skeleton/CategorySkeleton";
import ProductGridSkeleton from "../../components/skeleton/ProductGridSkeleton";
import { useApp } from "../../context/useApp";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./home.module.css";

// Dastlabki yuklanish faqat bir marta silliq skeleton ko'rsatishi uchun modul bayrog'i
let hasLoadedHomeOnce = false;

const Home = ({
  isActive = true,
  onSearchClick,
  onCategoryClick,
}) => {
  const [loading, setLoading] = useState(!hasLoadedHomeOnce);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useApp();

  // Dastlabki ochilishda sahifa sakrab ketmasligi va silliq ochilishi uchun sun'iy qisqa skeleton (550ms)
  useEffect(() => {
    if (!hasLoadedHomeOnce) {
      const timer = setTimeout(() => {
        hasLoadedHomeOnce = true;
        setLoading(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sayt ma'lumotlarini qayta yangilash (Refresh)
  const handleRefresh = useCallback(() => {
    if (isRefreshing || loading) return;

    triggerHaptic("medium");
    setIsRefreshing(true);
    setLoading(true);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      setLoading(false);
      setIsRefreshing(false);
      triggerHaptic("success");
      showToast("Yangilandi", "refresh");
    }, 600);
  }, [isRefreshing, loading, showToast]);

  return (
    <div className={styles.homeContainer}>
      <Header
        onSearchClick={onSearchClick}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <main className={styles.mainContent}>
        {loading ? (
          <div className={styles.skeletonWrapper} aria-busy="true">
            <BannerSkeleton />
            <CategorySkeleton />
            <ProductGridSkeleton />
          </div>
        ) : (
          <div className={styles.contentWrapper}>
            {/* Yuqori cheksiz banner */}
            <BannerCarousel
              isActive={isActive}
              onBannerClick={onCategoryClick}
            />

            {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
            <CategoryGrid onCategoryClick={onCategoryClick} />

            {/* Tavsiya qilingan mahsulotlar (3/4 aspect ratio, 2 ustunli mobil panjara) */}
            <ProductGrid />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
