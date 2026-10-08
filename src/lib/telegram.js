/**
 * Telegram Mini App (TMA) Integratsiya moduli
 * Telegram WebApp SDK bilan ishlash, ma'lumot almashish,
 * Haptic Feedback, BackButton va foydalanuvchi ma'lumotlarini boshqarish.
 */

// Telegram WebApp obyektini xavfsiz olish
export const getTelegramWebApp = () => {
  if (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp
  ) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Ilova haqiqatdan ham Telegram ichida ochilganini tekshirish
export const isTelegramApp = () => {
  if (typeof window === "undefined") return false;

  // Dasturchi rejimi (Brauzerda test qilish uchun bypass)
  if (sessionStorage.getItem("tma_dev_bypass") === "true") {
    return true;
  }

  const tg = getTelegramWebApp();
  if (!tg) return false;

  // URL parametrlarida Telegram Mini App tokeni yoki platformasi borligini tekshirish
  const hasTgParams =
    window.location.hash.includes("tgWebAppData") ||
    window.location.search.includes("tgWebAppData") ||
    window.location.search.includes("tgWebAppVersion") ||
    Boolean(tg.initData && tg.initData.length > 0);

  // Desktop Telegram, iOS yoki Android Telegram Webview
  const hasPlatform = tg.platform && tg.platform !== "unknown";

  return Boolean(hasTgParams || (hasPlatform && tg.initDataUnsafe?.user));
};

// Brauzer orqali test qilish uchun bypass rejimi
export const enableDevBrowserMode = () => {
  sessionStorage.setItem("tma_dev_bypass", "true");
  window.location.reload();
};

// Theme sinxronizatsiyasi (Telegram colorScheme / themeParams)
export const syncTelegramTheme = () => {
  const tg = getTelegramWebApp();
  if (typeof document === "undefined") return;

  const colorScheme =
    tg?.colorScheme ||
    (typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  const isDark = colorScheme === "dark";

  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  if (tg) {
    const headerColor = isDark ? "#171b21" : "#ffffff";
    const bgColor = isDark ? "#0f1216" : "#f8fafd";
    const bottomColor = isDark ? "#171b21" : "#ffffff";

    try {
      if (tg.setHeaderColor) tg.setHeaderColor(headerColor);
      if (tg.setBackgroundColor) tg.setBackgroundColor(bgColor);
      if (tg.setBottomBarColor) tg.setBottomBarColor(bottomColor);
    } catch {}
  }
};

// Safe area insets va top brand bar balandligini hisoblash
export const updateTelegramSafeArea = () => {
  const tg = getTelegramWebApp();
  if (!tg || typeof document === "undefined") return;

  try {
    const safeTop = tg.safeAreaInset?.top ?? 0;
    const safeBottom = tg.safeAreaInset?.bottom ?? 0;
    const contentSafeTop = tg.contentSafeAreaInset?.top ?? 0;
    const isFullscreen = Boolean(tg.isFullscreen);

    if (safeTop > 0) {
      document.documentElement.style.setProperty("--tg-safe-top", `${safeTop}px`);
    } else {
      document.documentElement.style.removeProperty("--tg-safe-top");
    }

    if (safeBottom > 0) {
      document.documentElement.style.setProperty("--tg-safe-bottom", `${safeBottom}px`);
    } else {
      document.documentElement.style.removeProperty("--tg-safe-bottom");
    }

    if (contentSafeTop > 0) {
      document.documentElement.style.setProperty("--tg-content-safe-top", `${contentSafeTop}px`);
    }

    // Top brand bar: safeAreaInset.top + contentSafeAreaInset.top
    // Fullscreen bo'lmaganda har ikkisi 0 va brand bar 0 ga kollaps bo'ladi
    const totalTopInsets = safeTop + contentSafeTop;
    if (totalTopInsets > 0) {
      const barHeightPx = Math.max(totalTopInsets, 44);
      document.documentElement.style.setProperty("--top-bar-height", `${barHeightPx / 10}rem`);
    } else if (isFullscreen) {
      document.documentElement.style.setProperty("--top-bar-height", "4.8rem");
    } else {
      document.documentElement.style.setProperty("--top-bar-height", "0rem");
    }
  } catch (err) {
    console.warn("updateTelegramSafeArea xatosi:", err);
  }
};

// Savat holatiga qarab closing confirmation ni boshqarish
export const updateClosingConfirmation = (hasItems) => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    if (hasItems) {
      if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
    } else {
      if (tg.disableClosingConfirmation) tg.disableClosingConfirmation();
    }
  } catch {}
};

// iOS WKWebView da :active ishlashi uchun passive no-op touchstart listener
if (typeof document !== "undefined") {
  document.addEventListener("touchstart", () => {}, { passive: true });
}

// Telegram Mini App ni to'liq ishga tushirish (faqat bir marta chaqiriladi)
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) {
    syncTelegramTheme();
    return;
  }

  try {
    // 1. Mini App tayyorligi va kengaytirish
    tg.ready();
    tg.expand();

    // 2. Bir marta to'liq ekran so'rash (ready dan keyin)
    requestTelegramFullscreen();

    // 3. Vertikal tasodifiy yopilishni bloklash
    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
    }

    // 4. Faol mavzuni (Dark / Light) sinxronlash
    syncTelegramTheme();

    // 5. Safe areani yangilash
    updateTelegramSafeArea();

    // 6. Hodisalarni tinglash
    if (typeof tg.onEvent === "function") {
      tg.onEvent("themeChanged", syncTelegramTheme);
      tg.onEvent("safeAreaChanged", updateTelegramSafeArea);
      tg.onEvent("contentSafeAreaChanged", updateTelegramSafeArea);
      tg.onEvent("fullscreenChanged", updateTelegramSafeArea);
      tg.onEvent("viewportChanged", updateTelegramSafeArea);
    }
  } catch (err) {
    console.warn("Telegram WebApp init xatosi:", err);
  }
};

// Telegram 8.0+ to'liq ekran (Fullscreen) rejimini so'rash yordamchisi
export const requestTelegramFullscreen = () => {
  const tg = getTelegramWebApp();
  if (!tg) return false;

  try {
    if (typeof tg.requestFullscreen === "function") {
      tg.requestFullscreen();
      updateTelegramSafeArea();
      return true;
    }
  } catch (err) {
    console.warn("Telegram requestFullscreen xatosi:", err);
  }

  // Telegram Native WebView postEvent fallback
  try {
    if (window.TelegramWebviewProxy && window.TelegramWebviewProxy.postEvent) {
      window.TelegramWebviewProxy.postEvent("web_app_request_fullscreen", JSON.stringify({}));
      updateTelegramSafeArea();
      return true;
    } else if (window.external && window.external.notify) {
      window.external.notify(JSON.stringify({ eventType: "web_app_request_fullscreen", eventData: {} }));
      updateTelegramSafeArea();
      return true;
    } else if (window.parent && window.parent.postMessage) {
      window.parent.postMessage(JSON.stringify({ eventType: "web_app_request_fullscreen", eventData: {} }), "*");
      updateTelegramSafeArea();
      return true;
    }
  } catch {}

  try {
    if (typeof tg.expand === "function") {
      tg.expand();
      updateTelegramSafeArea();
      return true;
    }
  } catch {}

  return false;
};

// Fullscreen holatini tekshirish
export const isTelegramFullscreen = () => {
  const tg = getTelegramWebApp();
  return Boolean(tg && tg.isFullscreen);
};

// Fullscreen dan chiqish
export const exitTelegramFullscreen = () => {
  const tg = getTelegramWebApp();
  if (!tg) return false;

  try {
    if (typeof tg.exitFullscreen === "function") {
      tg.exitFullscreen();
      return true;
    }
  } catch (err) {
    console.warn("Telegram exitFullscreen xatosi:", err);
  }
  return false;
};

// Taktil tebranishlar (Haptic Feedback) - Mobil Telegramda jonli his qilish uchun
export const triggerHaptic = (type = "light") => {
  const tg = getTelegramWebApp();
  if (!tg || !tg.HapticFeedback) return;

  try {
    switch (type) {
      case "light":
      case "medium":
      case "heavy":
      case "rigid":
      case "soft":
        tg.HapticFeedback.impactOccurred(type);
        break;
      case "success":
      case "error":
      case "warning":
        tg.HapticFeedback.notificationOccurred(type);
        break;
      case "selection":
        tg.HapticFeedback.selectionChanged();
        break;
      default:
        tg.HapticFeedback.impactOccurred("light");
    }
  } catch {
    // Brauzerda xatolik bermaydi
  }
};

// Telegram foydalanuvchisi ma'lumotlarini olish (Ism, Username, ID, Til)
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

// Botga ma'lumot yuborish (Savat buyurtmasi yoki harakat haqida)
export const sendTelegramData = (data) => {
  const tg = getTelegramWebApp();
  if (!tg) return false;

  try {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    tg.sendData(payload);
    return true;
  } catch (err) {
    console.warn("Telegram sendData xatosi:", err);
    return false;
  }
};

// Telegram nativ orqaga qaytish tugmasini (BackButton) sahifalarga ulash
export const syncTelegramBackButton = (show, onClick) => {
  const tg = getTelegramWebApp();
  if (!tg || !tg.BackButton) return;

  try {
    if (show) {
      tg.BackButton.show();
      if (onClick) {
        tg.BackButton.offClick(onClick); // Oldingi listenerlarni tozalash
        tg.BackButton.onClick(onClick);
      }
    } else {
      tg.BackButton.hide();
    }
  } catch {
    // Ignore in non-TMA
  }
};

// Telegram nativ BackButton mavjudligini tekshirish
export const isTelegramBackButtonAvailable = () => {
  const tg = getTelegramWebApp();
  return Boolean(tg && tg.BackButton && typeof tg.BackButton.show === "function");
};
