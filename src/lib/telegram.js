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

// Safe area insets (Telegram ekrani qirralari va native fullscreen tugmalari) ni CSS ga uzatish
export const updateTelegramSafeArea = () => {
  const tg = getTelegramWebApp();
  if (!tg || typeof document === "undefined") return;

  try {
    const safeTop = tg.safeAreaInset?.top ?? 0;
    const safeBottom = tg.safeAreaInset?.bottom ?? 0;
    const contentSafeTop = tg.contentSafeAreaInset?.top ?? 0;

    if (safeTop > 0) {
      document.documentElement.style.setProperty("--tg-safe-top", `${safeTop}px`);
    }
    if (safeBottom > 0) {
      document.documentElement.style.setProperty("--tg-safe-bottom", `${safeBottom}px`);
    }
    if (contentSafeTop > 0) {
      document.documentElement.style.setProperty("--tg-content-safe-top", `${contentSafeTop}px`);
    }
  } catch (err) {
    console.warn("updateTelegramSafeArea xatosi:", err);
  }
};

// Telegram Mini App ni to'liq ishga tushirish va sozlash
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    // 1. Mini App tayyorligini botga bildirish
    tg.ready();

    // 2. Ilovani butun ekran bo'ylab kengaytirish
    tg.expand();

    // 3. Telegram 8.0+ Native Fullscreen rejimini so'rash (To'liq nativ ilovadek ochilishi uchun)
    requestTelegramFullscreen();

    // Ba'zi mobil Telegram mijozlarida birinchi sensor/bosish orqali ham fullscreen kafolati
    const handleFirstInteraction = () => {
      requestTelegramFullscreen();
    };
    window.addEventListener("touchstart", handleFirstInteraction, {
      passive: true,
      once: true,
    });
    window.addEventListener("pointerdown", handleFirstInteraction, {
      passive: true,
      once: true,
    });
    window.addEventListener("click", handleFirstInteraction, {
      passive: true,
      once: true,
    });

    // 4. Telegram 7.7+ vertikal tortib tasodifiy yopilib ketishining oldini olish (Swipe-to-close blocking)
    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
    }

    // 5. Telegram sarlavhasi va foni ranglarini sayt dizayniga moslashtirish
    if (tg.setHeaderColor) {
      tg.setHeaderColor("#ffffff");
    }
    if (tg.setBackgroundColor) {
      tg.setBackgroundColor("#f8fafd");
    }
    if (tg.setBottomBarColor) {
      tg.setBottomBarColor("#ffffff");
    }

    // 6. Tasodifiy yopilishlarni oldini olish
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }

    // 7. Safe area insets (Telegram ekrani qirralari) ni CSS ga ulash va hodisalarni tinglash
    updateTelegramSafeArea();

    if (typeof tg.onEvent === "function") {
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
