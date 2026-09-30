import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useApp } from "../../context/useApp";
import styles from "./toastAlert.module.css";

const ToastAlert = () => {
  const { toast, hideToast } = useApp();

  const handleDragEnd = (_, info) => {
    // Agar foydalanuvchi barmoq bilan 50px dan ko'proq chapga yoki o'ngga sursa, toast yopiladi
    if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 300) {
      hideToast();
    }
  };

  return (
    <div className={styles.toastContainer} aria-live="polite">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key={toast.id}
            className={styles.toastPill}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.94,
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
              mass: 0.8,
            }}
            whileTap={{ cursor: "grabbing" }}
          >
            {/* Yashil doirasimon belgi va oq galochka */}
            <div className={styles.iconCircle}>
              <Check size={14} strokeWidth={3} />
            </div>

            {/* Xabarnoma matni */}
            <span className={styles.message}>
              {toast.message || "Mahsulot savatga qo'shildi"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastAlert;
