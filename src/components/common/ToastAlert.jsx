import { motion, AnimatePresence } from "framer-motion";
import { RotateCw } from "lucide-react";
import { useApp } from "../../context/useApp";
import styles from "./toastAlert.module.css";

// Instagram rasmiy tasdiqlangan (verified) nishoni (scalloped rosette + oq galochka)
const InstagramVerifiedBadge = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.verifiedSvg}
  >
    {/* Instagram scalloped gulbarg shakli (sayt brand ko'k rangida: var(--primary)) */}
    <path
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      fill="var(--primary)"
    />
    {/* Oq rangdagi nozik va o'tkir galochka */}
    <path
      d="m16 9-5.5 5.5L8 12"
      stroke="var(--white)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToastAlert = () => {
  const { toast } = useApp();
  const isRefresh = toast.type === "refresh";

  return (
    <div className={styles.toastContainer} aria-live="polite">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            key={`alert-${toast.id}`}
            className={`${styles.alertPill} ${isRefresh ? styles.refreshPill : ""}`}
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
            {/* Ikonka (Savat uchun Instagram badge, Refresh uchun RotateCw) */}
            <motion.span
              key={`icon-${toast.id}`}
              className={styles.iconWrapper}
              initial={{ opacity: 0.6, rotate: isRefresh ? -120 : 0 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {isRefresh ? (
                <RotateCw
                  size={17}
                  stroke="var(--white)"
                  strokeWidth={2.4}
                  className={styles.refreshIcon}
                />
              ) : (
                <InstagramVerifiedBadge size={19} />
              )}
            </motion.span>

            {/* Oq rangdagi jiddiy va toza yozuv */}
            <span className={styles.label}>
              {isRefresh ? "Yangilandi" : "Qo'shildi"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastAlert;
