import { useState, useEffect, useCallback, useMemo } from "react";
import { triggerHaptic } from "../lib/telegram";
import { AppContext } from "./AppContextInstance";

const CART_STORAGE_KEY = "ecommerce_cart_items";
const LIKES_STORAGE_KEY = "ecommerce_liked_ids";

export const AppProvider = ({ children }) => {
  // 1. Savatcha holati (localStorage bilan sinxron)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {};
  });

  // 2. Sevimlilar (Likes) holati (localStorage bilan sinxron)
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 3. Savatga qo'shilgandagi xabarnoma (Toast Alert) holati
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    count: 1,
    id: 0,
  });

  // Savatcha o'zgarganda localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sevimlilar o'zgarganda localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      // ignore
    }
  }, [likedIds]);

  // Toast avtomatik yopilishi uchun taymer (har safar yangi qo'shilganda yangilanadi)
  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false, count: 1 }));
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast.visible, toast.id]);

  // Toast ko'rsatish: agar alert allaqachon ko'rinib turgan bo'lsa, uni yo'qotmasdan va ikkinchisini chiqarmasdan
  // mavjud alertning taymerini yangitdan boshlaydi
  const showToast = useCallback((message = "Qo'shildi") => {
    setToast((prev) => {
      const isAlreadyVisible = prev.visible;
      return {
        visible: true,
        message,
        count: isAlreadyVisible ? prev.count + 1 : 1,
        id: Date.now(),
      };
    });
  }, []);

  // Toast yopish
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false, count: 1 }));
  }, []);

  // Mahsulotning savatdagi soni
  const getCartQuantity = useCallback(
    (productId) => {
      return cart[productId] || 0;
    },
    [cart],
  );

  // Savatga mahsulot qo'shish / oshirish
  const addToCart = useCallback(
    (productId) => {
      triggerHaptic("success");
      setCart((prev) => {
        const currentQty = prev[productId] || 0;
        return {
          ...prev,
          [productId]: currentQty + 1,
        };
      });
      showToast("Qo'shildi");
    },
    [showToast],
  );

  // Savatdagi sonni o'zgartirish (+ / -)
  const updateCartQuantity = useCallback(
    (productId, delta) => {
      setCart((prev) => {
        const currentQty = prev[productId] || 0;
        const newQty = currentQty + delta;

        if (newQty <= 0) {
          triggerHaptic("light");
          const next = { ...prev };
          delete next[productId];
          return next;
        }

        if (delta > 0) {
          triggerHaptic("selection");
          showToast("Qo'shildi");
        } else {
          triggerHaptic("light");
        }

        return {
          ...prev,
          [productId]: newQty,
        };
      });
    },
    [showToast],
  );

  // Sevimlilar (Like) ni yoqish / o'chirish
  const toggleLike = useCallback((productId) => {
    triggerHaptic("medium");
    setLikedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  // Mahsulot sevimlilar qatoridami?
  const isLiked = useCallback(
    (productId) => {
      return likedIds.includes(productId);
    },
    [likedIds],
  );

  // Jami savatdagi mahsulotlar soni (Badge uchun)
  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  // Jami sevimlilar soni (Badge uchun)
  const totalLikedCount = useMemo(() => {
    return likedIds.length;
  }, [likedIds]);

  const value = useMemo(
    () => ({
      cart,
      getCartQuantity,
      addToCart,
      updateCartQuantity,
      totalCartCount,
      likedIds,
      isLiked,
      toggleLike,
      totalLikedCount,
      toast,
      showToast,
      hideToast,
    }),
    [
      cart,
      getCartQuantity,
      addToCart,
      updateCartQuantity,
      totalCartCount,
      likedIds,
      isLiked,
      toggleLike,
      totalLikedCount,
      toast,
      showToast,
      hideToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
