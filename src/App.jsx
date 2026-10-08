import { useState, useEffect, useCallback, useRef } from "react";
import Home from "./pages/home/Home";
import SearchPage from "./pages/search/SearchPage";
import Menu from "./components/menu/Menu";
import ToastAlert from "./components/common/ToastAlert";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { initTelegramApp, syncTelegramBackButton } from "./lib/telegram";
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

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // Sahifa yangilanganda URL ni tozalash, scrollni 0 ga surish va Telegram xususiyatlarini tayyorlash
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      if (window.location.pathname !== "/" || window.location.search) {
        window.history.replaceState({ page: "home" }, "", "/");
      }
    }
    initTelegramApp();
  }, []);

  // Sahifalar scroll pozitsiyalarini eslab qolish (Apple & Android native tab memory)
  const scrollPositions = useRef({ home: 0, search: 0 });

  // Brauzer tarixi (Back, Forward, Swipe-back) hodisasini boshqarish
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath();
      const query = getSearchQueryFromUrl();
      setCurrentPage(page);
      setSearchQuery(query);
      setActiveTab(page === "search" ? 1 : 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Search sahifasiga o'tish (route /search yoki /search?q=... ga o'zgaradi)
  const handleGoToSearch = useCallback(
    (query = "") => {
      if (currentPage === "search" && !query) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (currentPage === "home") {
        scrollPositions.current.home = window.scrollY;
      }

      const trimmed = typeof query === "string" ? query.trim() : "";
      const targetUrl = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";

      if (
        window.location.pathname !== "/search" ||
        window.location.search !==
          (trimmed ? `?q=${encodeURIComponent(trimmed)}` : "")
      ) {
        window.history.pushState(
          { page: "search", query: trimmed },
          "",
          targetUrl,
        );
      }

      setSearchQuery(trimmed);
      setCurrentPage("search");
      setActiveTab(1);

      const targetY = trimmed ? 0 : scrollPositions.current.search || 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: "instant" });
      });
    },
    [currentPage],
  );

  // Home sahifasiga qaytish (route / ga o'zgaradi)
  const handleGoToHome = useCallback(() => {
    if (currentPage === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentPage === "search") {
      scrollPositions.current.search = window.scrollY;
    }

    if (window.location.pathname !== "/") {
      window.history.pushState({ page: "home" }, "", "/");
    }
    setCurrentPage("home");
    setSearchQuery("");
    setActiveTab(0);

    const targetY = scrollPositions.current.home || 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: "instant" });
    });
  }, [currentPage]);

  // Telegram nativ orqaga qaytish (BackButton) tugmasini sahifalar bilan sinxronlash
  useEffect(() => {
    if (currentPage === "search") {
      syncTelegramBackButton(true, handleGoToHome);
    } else {
      syncTelegramBackButton(false);
    }

    return () => {
      syncTelegramBackButton(false);
    };
  }, [currentPage, handleGoToHome]);

  // Pastki Tab bar menyusi orqali o'tish
  const handleTabChange = useCallback(
    (index) => {
      setActiveTab(index);
      if (index === 1) {
        handleGoToSearch();
      } else if (index === 0) {
        handleGoToHome();
      }
    },
    [handleGoToSearch, handleGoToHome],
  );

  const handleHomeSearchClick = useCallback(() => {
    handleGoToSearch("");
  }, [handleGoToSearch]);

  const handleHomeCategoryClick = useCallback(
    (catTitle) => {
      handleGoToSearch(catTitle);
    },
    [handleGoToSearch],
  );

  return (
    <div className="appContainer">
      {/*
        Bosh sahifa (Home) doimo DOM-da saqlanadi — hech qanday splash delaylarsiz, darhol ochiladi
      */}
      <div
        className={`pageWrapper ${isHomeActive ? "pageFade" : ""}`}
        style={{ display: isHomeActive ? "block" : "none" }}
      >
        <Home
          isActive={isHomeActive}
          onSearchClick={handleHomeSearchClick}
          onCategoryClick={handleHomeCategoryClick}
        />
      </div>

      {/*
        Professional Qidiruv Sahifasi (SearchPage)
      */}
      <div
        className={`pageWrapper ${currentPage === "search" ? "pageFade" : ""}`}
        style={{ display: currentPage === "search" ? "block" : "none" }}
      >
        <SearchPage
          isActive={currentPage === "search"}
          onBack={handleGoToHome}
          initialQuery={searchQuery}
        />
      </div>

      {/* Suzuvchi savatcha bildirishnomasi */}
      <ToastAlert />

      {/* Pastki navigatsiya menyusi — har doim o'zining barqaror o'rnida */}
      <Menu active={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
};

export default App;
