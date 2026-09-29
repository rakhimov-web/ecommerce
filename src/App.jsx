import { useState, useEffect, useCallback } from "react";
import Home from "./pages/home/Home";
import SearchPage from "./pages/search/SearchPage";
import Menu from "./components/menu/Menu";
import "./App.css";

// URL dan joriy sahifani aniqlash (/search -> "search", boshqasi -> "home")
const getPageFromPath = () => {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.toLowerCase();
  return path.startsWith("/search") ? "search" : "home";
};

// URL dan qidiruv parametrini olish (?q=...)
const getSearchQueryFromUrl = () => {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  } catch {
    return "";
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(getPageFromPath);
  const [searchQuery, setSearchQuery] = useState(getSearchQueryFromUrl);

  // Brauzer tarixi (Back, Forward, Swipe-back) hodisasini boshqarish
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath();
      const query = getSearchQueryFromUrl();
      setCurrentPage(page);
      setSearchQuery(query);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Search sahifasiga o'tish (route /search yoki /search?q=... ga o'zgaradi)
  const handleGoToSearch = useCallback((query = "") => {
    const trimmed = typeof query === "string" ? query.trim() : "";
    const targetUrl = trimmed
      ? `/search?q=${encodeURIComponent(trimmed)}`
      : "/search";

    if (
      window.location.pathname !== "/search" ||
      window.location.search !== (trimmed ? `?q=${encodeURIComponent(trimmed)}` : "")
    ) {
      window.history.pushState({ page: "search", query: trimmed }, "", targetUrl);
    }

    setSearchQuery(trimmed);
    setCurrentPage("search");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Home sahifasiga qaytish (route / ga o'zgaradi)
  const handleGoToHome = useCallback(() => {
    if (window.location.pathname !== "/") {
      window.history.pushState({ page: "home" }, "", "/");
    }
    setCurrentPage("home");
    setSearchQuery("");
  }, []);

  // Pastki Tab bar menyusi orqali o'tish
  const handleTabChange = useCallback(
    (index) => {
      if (index === 1) {
        handleGoToSearch();
      } else if (index === 0) {
        handleGoToHome();
      }
    },
    [handleGoToSearch, handleGoToHome]
  );

  const activeTab = currentPage === "search" ? 1 : 0;
  const isHomeActive = currentPage === "home";

  return (
    <div className="appContainer">
      {/* 
        Bosh sahifa (Home) doimo DOM-da saqlanadi:
        Qidiruvdan qaytganda sayt qayta yangilanmaydi,
        skeleton qaytadan chiqmaydi va scroll joyi saqlanadi.
      */}
      <div
        className={`pageWrapper ${isHomeActive ? "pageFade" : ""}`}
        style={{ display: isHomeActive ? "block" : "none" }}
      >
        <Home
          isActive={isHomeActive}
          onSearchClick={() => handleGoToSearch("")}
          onCategoryClick={(catTitle) => handleGoToSearch(catTitle)}
        />
      </div>

      {/* 
        Professional Qidiruv Sahifasi (SearchPage):
        Jahon darajasidagi e-commerce ilovalari (Apple, Uzum) standartida yaratilgan.
      */}
      <div
        className={`pageWrapper ${currentPage === "search" ? "pageFade" : ""}`}
        style={{ display: currentPage === "search" ? "block" : "none" }}
      >
        <SearchPage
          onBack={handleGoToHome}
          initialQuery={searchQuery}
        />
      </div>

      {/* Pastki navigatsiya menyusi — indicator silliq siljiydi */}
      <Menu active={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
