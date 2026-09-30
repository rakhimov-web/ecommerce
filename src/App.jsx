import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/home/Home";
import SearchPage from "./pages/search/SearchPage";
import Menu from "./components/menu/Menu";
import BrandSplashLoader from "./components/loader/BrandSplashLoader";
import ToastAlert from "./components/common/ToastAlert";
import { AppProvider } from "./context/AppContext";
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
  // Sayt har safar yangilanganda (refresh) to'g'ridan-to'g'ri Home sahifasidan va Brand Loader bilan ochiladi
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSplashActive, setIsSplashActive] = useState(true);

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
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Search sahifasiga o'tish (route /search yoki /search?q=... ga o'zgaradi)
  const handleGoToSearch = useCallback(
    (query = "") => {
      // Agar allaqachon Qidiruvda bo'lsa va tab yana bosilsa -> tepaga silliq qaytish
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

      // Agar kategoriya bosilgan bo'lsa tepadan ochiladi, tab bosilganda saqlangan joyiga qaytadi
      const targetY = trimmed ? 0 : scrollPositions.current.search || 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: "instant" });
      });
    },
    [currentPage],
  );

  // Home sahifasiga qaytish (route / ga o'zgaradi)
  const handleGoToHome = useCallback(() => {
    // Agar foydalanuvchi allaqachon Homeda bo'lsa va tabni qayta bossa -> smooth scroll tepaga
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

    // Home sahifasidagi oldingi scroll joyini tiklash
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
      if (index === 1) {
        handleGoToSearch();
      } else if (index === 0) {
        handleGoToHome();
      }
    },
    [handleGoToSearch, handleGoToHome],
  );

  const activeTab = currentPage === "search" ? 1 : 0;
  const isHomeActive = currentPage === "home";

  return (
    <div className="appContainer">
      {/*
        Lottie sifatidagi yuqori darajadagi brend animatsiyali SVG loader
        Har bir sayt ochilishida va refresh bo'lganda ko'rinadi
      */}
      <AnimatePresence>
        {isSplashActive && (
          <BrandSplashLoader
            key="brand-splash-loader"
            onComplete={() => setIsSplashActive(false)}
          />
        )}
      </AnimatePresence>

      {/*
        Bosh sahifa (Home) doimo DOM-da saqlanadi:
        Splash tugagach, ma'lumotlar kelgunicha Skeleton loader ko'rinadi,
        so'ng haqiqiy kontent namoyon bo'ladi.
      */}
      <motion.div
        className={`pageWrapper ${isHomeActive ? "pageFade" : ""}`}
        style={{ display: isHomeActive ? "block" : "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSplashActive ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Home
          isActive={isHomeActive}
          isSplashFinished={!isSplashActive}
          onSearchClick={() => handleGoToSearch("")}
          onCategoryClick={(catTitle) => handleGoToSearch(catTitle)}
        />
      </motion.div>

      {/*
        Professional Qidiruv Sahifasi (SearchPage):
        Jahon darajasidagi e-commerce ilovalari (Apple, Uzum) standartida yaratilgan.
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

      {/* Suzuvchi savatcha bildirishnomasi (Toast Alert — barmoq bilan surib yopish imkoniyati bilan) */}
      <ToastAlert />

      {/* Pastki navigatsiya menyusi — indicator silliq siljiydi */}
      <Menu active={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
