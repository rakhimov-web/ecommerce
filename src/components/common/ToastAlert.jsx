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
            key="apple-minimal-alert"
            className={styles.alertPill}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 8,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{
              duration: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Minimalist Apple Checkmark badge */}
            <motion.span
              key={`icon-${toast.id}`}
              className={styles.iconWrapper}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Check size={14} strokeWidth={2.6} />
            </motion.span>

            {/* Sof va jiddiy xabarnoma yozuvi */}
            <span className={styles.label}>Qo'shildi</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastAlert;

