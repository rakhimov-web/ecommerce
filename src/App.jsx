import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/home/Home";
import SearchPage from "./pages/search/SearchPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import Menu from "./components/menu/Menu";
import BrandSplashLoader from "./components/loader/BrandSplashLoader";
import ToastAlert from "./components/common/ToastAlert";
import { AppProvider } from "./context/AppContext";
import { initTelegramApp, syncTelegramBackButton } from "./lib/telegram";
import { productsData } from "./data/products";
import "./App.css";

// URL dan joriy sahifani aniqlash (/search -> "search", /product/:id -> "product", boshqasi -> "home")
const getPageFromPath = () => {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith("/search")) return "search";
  if (path.startsWith("/product/")) return "product";
  return "home";
};

// URL dan mahsulot ID sini olish (/product/1 -> 1)
const getProductIdFromPath = () => {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  const match = path.match(/^\/product\/([^/?#]+)/i);
  if (!match) return null;
  const idNum = Number(match[1]);
  return isNaN(idNum) ? match[1] : idNum;
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
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Qaysi sahifadan Product Detail ga o'tganimizni eslab qolish ("home" yoki "search")
  const previousPageRef = useRef("home");

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
      const prodId = getProductIdFromPath();
      setCurrentPage(page);
      setSearchQuery(query);
      setSelectedProductId(prodId);

      if (page === "home") {
        setActiveTab(0);
      } else if (page === "search") {
        setActiveTab(1);
      }
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

  // Mahsulot batafsil sahifasiga o'tish (/product/:id)
  const handleGoToProduct = useCallback(
    (productId) => {
      if (currentPage === "home") {
        scrollPositions.current.home = window.scrollY;
        previousPageRef.current = "home";
      } else if (currentPage === "search") {
        scrollPositions.current.search = window.scrollY;
        previousPageRef.current = "search";
      }

      setSelectedProductId(productId);
      setCurrentPage("product");

      window.history.pushState(
        { page: "product", id: productId },
        "",
        `/product/${productId}`,
      );

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    },
    [currentPage],
  );

  // Mahsulot batafsil sahifasidan ortga qaytish (foydalanuvchi kelgan joyiga mos ravishda)
  const handleBackFromProduct = useCallback(() => {
    if (previousPageRef.current === "search") {
      const targetUrl = searchQuery
        ? `/search?q=${encodeURIComponent(searchQuery)}`
        : "/search";
      if (window.location.pathname !== "/search") {
        window.history.pushState(
          { page: "search", query: searchQuery },
          "",
          targetUrl,
        );
      }
      setCurrentPage("search");
      setActiveTab(1);

      const targetY = scrollPositions.current.search || 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: "instant" });
      });
    } else {
      if (window.location.pathname !== "/") {
        window.history.pushState({ page: "home" }, "", "/");
      }
      setCurrentPage("home");
      setActiveTab(0);

      const targetY = scrollPositions.current.home || 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: "instant" });
      });
    }
  }, [searchQuery]);

  // Telegram nativ orqaga qaytish (BackButton) tugmasini sahifalar bilan sinxronlash
  useEffect(() => {
    if (currentPage === "product") {
      syncTelegramBackButton(true, handleBackFromProduct);
    } else if (currentPage === "search") {
      syncTelegramBackButton(true, handleGoToHome);
    } else {
      syncTelegramBackButton(false);
    }

    return () => {
      syncTelegramBackButton(false);
    };
  }, [currentPage, handleBackFromProduct, handleGoToHome]);

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

  // Tanlangan mahsulot obyektini topish
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return (
      productsData.find(
        (p) =>
          p.id === selectedProductId ||
          String(p.id) === String(selectedProductId),
      ) || productsData[0]
    );
  }, [selectedProductId]);

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
          onProductClick={handleGoToProduct}
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
          onProductClick={handleGoToProduct}
        />
      </div>

      {/*
        Mahsulot Batafsil Sahifasi (ProductDetailPage):
        - Headerda faqat Ortga qaytish, Like va Savatcha
        - Katta, swipe qilinadigan karusel galereyasi
        - Narx, muddatli to'lov va to'liq tavsif
        - Pastki sticky checkout bari (Stepper + Rasmiylashtirish)
      */}
      {currentPage === "product" && (
        <div className="pageWrapper pageFade">
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackFromProduct}
          />
        </div>
      )}

      {/* Suzuvchi savatcha bildirishnomasi (Toast Alert — barmoq bilan surib yopish imkoniyati bilan) */}
      <ToastAlert />

      {/*
        Pastki navigatsiya menyusi — faqat Home va Search sahifalarida ko'rinadi.
        Product Detail sahifasida to'liq yashiriladi.
      */}
      {currentPage !== "product" && (
        <Menu active={activeTab} onTabChange={handleTabChange} />
      )}
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
