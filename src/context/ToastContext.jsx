import { useState, useEffect, useCallback, useMemo } from "react";
import { ToastContext } from "./ToastContextInstance";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "Qo'shildi",
    type: "cart",
    count: 1,
    id: 0,
  });

  // Toast avtomatik yopilishi uchun taymer
  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false, count: 1 }));
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast.visible, toast.id]);

  const showToast = useCallback((message = "Qo'shildi", type = "cart") => {
    setToast((prev) => {
      const isAlreadyVisible = prev.visible;
      const toastType =
        type === "refresh" || message === "Yangilandi" ? "refresh" : "cart";
      return {
        visible: true,
        message,
        type: toastType,
        count: isAlreadyVisible ? prev.count + 1 : 1,
        id: Date.now(),
      };
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false, count: 1 }));
  }, []);

  const value = useMemo(
    () => ({
      toast,
      showToast,
      hideToast,
    }),
    [toast, showToast, hideToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

