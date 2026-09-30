import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useApp } from "../../context/useApp";
import styles from "./toastAlert.module.css";

const ToastAlert = () => {
  const { toast } = useApp();

  return (
    <div className={styles.toastContainer} aria-live="polite">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key="ios-app-alert"
            className={styles.toastPill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 14,
              transition: { duration: 0.16, ease: "easeOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 440,
              damping: 30,
              mass: 0.8,
            }}
          >
            {/* iOS uslubidagi yashil doiracha va oq galochka */}
            <motion.div
              key={`icon-${toast.id}`}
              className={styles.iconCircle}
              initial={{ scale: 0.82 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <Check size={15} strokeWidth={2.8} />
            </motion.div>

            {/* Xabarnoma matni */}
            <div className={styles.textContainer}>
              <span className={styles.message}>
                {toast.message || "Mahsulot savatga qo'shildi"}
              </span>
            </div>

            {/* Ketma-ket qo'shilganda aqlli hisoblagich (masalan, +2, +3) */}
            {toast.count > 1 && (
              <motion.span
                key={`badge-${toast.count}`}
                className={styles.streakBadge}
                initial={{ scale: 0.7, opacity: 0 }}
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

