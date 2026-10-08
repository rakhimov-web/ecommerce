import { useState, useCallback } from "react";
import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import ProductGrid from "../../components/products/ProductGrid";
import { useApp } from "../../context/useApp";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./home.module.css";

const Home = ({
  isActive = true,
  onSearchClick,
  onCategoryClick,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useApp();

  // Sayt ma'lumotlarini qayta yangilash (Refresh)
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;

    triggerHaptic("medium");
    setIsRefreshing(true);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    triggerHaptic("success");
    showToast("Yangilandi", "refresh");
    setIsRefreshing(false);
  }, [isRefreshing, showToast]);

  return (
    <div className={styles.homeContainer}>
      <Header
        onSearchClick={onSearchClick}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <main className={styles.mainContent}>
        {/* Yuqori cheksiz banner */}
        <BannerCarousel
          isActive={isActive}
          onBannerClick={onCategoryClick}
        />

        {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
        <CategoryGrid onCategoryClick={onCategoryClick} />

        {/* Tavsiya qilingan mahsulotlar (3/4 aspect ratio, 2 ustunli mobil panjara) */}
        <ProductGrid />
      </main>
    </div>
  );
};

export default Home;
