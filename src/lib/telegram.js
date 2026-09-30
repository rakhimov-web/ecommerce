/**
 * Telegram Mini App (TMA) Maksimal Integratsiya moduli
 * Telegram WebApp SDK bilan ishlash, bot bilan ma'lumot almashish,
 * Haptic Feedback, BackButton, swipe-to-close himoyasi va safe-area boshqaruvi.
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

// Ilova haqiqatdan ham Telegram ichida ochilganini aniqlash
export const isTelegramApp = () => {
  if (typeof window === "undefined") return false;

  const tg = getTelegramWebApp();
  if (!tg) return false;

  const hasTgParams =
    window.location.hash.includes("tgWebAppData") ||
    window.location.search.includes("tgWebAppData") ||
    window.location.search.includes("tgWebAppVersion") ||
    Boolean(tg.initData && tg.initData.length > 0);

  const hasPlatform = tg.platform && tg.platform !== "unknown";

  return Boolean(hasTgParams || (hasPlatform && tg.initDataUnsafe?.user));
};

// Telegram Mini App ni to'liq ishga tushirish va maksimal botga moslash
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    // 1. Mini App tayyorligini Telegram bot mijoziga bildirish
    tg.ready();

    // 2. Ilovani butun ekran bo'ylab maksimal kengaytirish
    tg.expand();

    // 3. Telegram 7.7+ vertikal tortib tasodifiy yopilib ketishining oldini olish (Swipe-to-close blocking)
    if (tg.disableVerticalSwipes) {
      tg.disableVerticalSwipes();
    }

    // 4. Telegram sarlavhasi va foni ranglarini sayt dizayni bilan 100% uyg'unlashtirish
    if (tg.setHeaderColor) {
      tg.setHeaderColor("#ffffff");
    }
    if (tg.setBackgroundColor) {
      tg.setBackgroundColor("#f8fafd");
    }
    if (tg.setBottomBarColor) {
      tg.setBottomBarColor("#ffffff");
    }

    // 5. Tasodifiy yopilishlarni oldini olish uchun tasdiqlovchi dialog yoqish
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }

    // 6. Safe area insets (Telegram ekrani qirralari) ni CSS o'zgaruvchilariga ulash
    if (tg.safeAreaInset) {
      document.documentElement.style.setProperty(
        "--tg-safe-top",
        `${tg.safeAreaInset.top}px`
      );
      document.documentElement.style.setProperty(
        "--tg-safe-bottom",
        `${tg.safeAreaInset.bottom}px`
      );
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

// Telegram foydalanuvchisi ma'lumotlarini olish (Ism, Username, ID, Til, Photo)
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

// Botga ma'lumot yuborish (Savat buyurtmasi yoki buyurtma tafsilotlari)
export const sendTelegramData = (data) => {
  const tg = getTelegramWebApp();
  if (!tg) return false;

  try {
    triggerHaptic("success");
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
        tg.BackButton.offClick(onClick);
        tg.BackButton.onClick(onClick);
      }
    } else {
      tg.BackButton.hide();
    }
  } catch {
    // Ignore in non-TMA
  }
};

// Telegram havolasini ochish
export const openTelegramLink = (url) => {
  const tg = getTelegramWebApp();
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(url);
  } else if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
};
