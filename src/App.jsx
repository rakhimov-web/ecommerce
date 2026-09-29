import { useState } from "react";
import Home from "./pages/home/Home";
import SearchPage from "./pages/search/SearchPage";
import Menu from "./components/menu/Menu";
import "./App.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "search"

  const handleGoToSearch = () => {
    setCurrentPage("search");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleGoToHome = () => {
    setCurrentPage("home");
  };

  const handleTabChange = (index) => {
    if (index === 1) {
      handleGoToSearch();
    } else if (index === 0) {
      handleGoToHome();
    }
  };

  const activeTab = currentPage === "search" ? 1 : 0;

  return (
    <div className="appContainer">
      {/*
        Bosh sahifa (Home) doimo DOM-da saqlanadi:
        Qidiruvdan qaytganda sayt qayta yangilanmaydi,
        skeleton qaytadan chiqmaydi va scroll joyi saqlanadi.
      */}
      <div
        className={`pageWrapper ${currentPage === "home" ? "pageFade" : ""}`}
        style={{ display: currentPage === "home" ? "block" : "none" }}
      >
        <Home onSearchClick={handleGoToSearch} />
      </div>

      {/*
        Professional Qidiruv Sahifasi (SearchPage):
        Jahon darajasidagi e-commerce ilovalari (Apple, Uzum) standartida yaratilgan.
      */}
      <div
        className={`pageWrapper ${currentPage === "search" ? "pageFade" : ""}`}
        style={{ display: currentPage === "search" ? "block" : "none" }}
      >
        <SearchPage onBack={handleGoToHome} />
      </div>

      {/* Pastki navigatsiya menyusi — indicator silliq siljiydi */}
      <Menu active={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
