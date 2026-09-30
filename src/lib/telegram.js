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

// Telegram Mini App ni to'liq ishga tushirish va sozlash
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    // 1. Mini App tayyorligini botga bildirish
    tg.ready();

    // 2. Ilovani butun ekran bo'ylab kengaytirish (swipe-down yopilib ketishining oldini oladi)
    tg.expand();

    // 3. Telegram sarlavhasi va foni ranglarini sayt dizayniga moslashtirish
    if (tg.setHeaderColor) {
      tg.setHeaderColor("#ffffff");
    }
    if (tg.setBackgroundColor) {
      tg.setBackgroundColor("#f8fafd");
    }

    // 4. Tasodifiy yopilishlarni oldini olish
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }
  } catch (err) {
    console.warn("Telegram WebApp init xatosi:", err);
  }
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
