import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useApp } from "../../context/useApp";
import styles from "./toastAlert.module.css";

const ToastAlert = () => {
  const { toast, totalCartCount } = useApp();

  return (
    <div className={styles.toastContainer} aria-live="polite">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key="apple-master-alert"
            className={styles.toastCard}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 10,
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 32,
              mass: 0.8,
            }}
          >
            {/* Apple uslubidagi minimalist squircle belgi */}
            <motion.div
              key={`icon-${toast.id}`}
              className={styles.iconBox}
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
            >
              <Check size={15} strokeWidth={2.6} />
            </motion.div>

            {/* Ikki pog'onali professional axborot iyerarxiyasi */}
            <div className={styles.textContent}>
              <div className={styles.titleRow}>
                <span className={styles.title}>
                  {toast.message || "Savatga qo'shildi"}
                </span>
              </div>
              <span className={styles.subtitle}>
                Savatda jami: {totalCartCount} ta mahsulot
              </span>
            </div>

            {/* O'ng tomondagi ketma-ket qo'shilish hisoblagich nishoni */}
            {toast.count > 1 && (
              <motion.span
                key={`badge-${toast.count}`}
                className={styles.streakBadge}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 550, damping: 22 }}
              >
                +{toast.count}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastAlert;

