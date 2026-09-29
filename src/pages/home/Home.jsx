import Header from "../../components/header/Header";
import BannerCarousel from "../../components/banner/BannerCarousel";
import CategoryGrid from "../../components/categories/CategoryGrid";
import Menu from "../../components/menu/Menu";

const Home = () => {
  return (
    <div style={{ paddingTop: "68px", paddingBottom: "80px", minHeight: "100vh" }}>
      <Header />
      <main>
        {/* Yuqori cheksiz banner */}
        <BannerCarousel />

        {/* Asosiy toifalar (Telefon, Noutbuk, iPad, Apple Watch, Aksessuarlar) */}
        <CategoryGrid />

        {/* Kelgusi qism: Mahsulotlar kartochkalari ro'yxati */}
      </main>
      <Menu />
    </div>
  );
};

export default Home;
