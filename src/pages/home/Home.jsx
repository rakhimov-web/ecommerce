import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import ProductGrid from "../../components/products/ProductGrid";
import Menu from "../../components/menu/Menu";

const Home = () => {
  return (
    <div style={{ paddingTop: "64px", paddingBottom: "76px", minHeight: "100vh" }}>
      <Header />
      <main>
        {/* Yuqori cheksiz banner */}
        <BannerCarousel />

        {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
        <CategoryGrid />

        {/* Tavsiya qilingan mahsulotlar (3/4 aspect ratio, 2 ustunli mobil panjara) */}
        <ProductGrid />
      </main>
      <Menu />
    </div>
  );
};

export default Home;
