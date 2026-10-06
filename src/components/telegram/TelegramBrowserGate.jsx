import { motion } from "framer-motion";
import { Send, Smartphone, Code } from "lucide-react";
import logoImg from "../../assets/icons/logo.svg";
import { enableDevBrowserMode } from "../../lib/telegram";
import { BRAND_CONFIG } from "../../config/brand";
import styles from "./telegramBrowserGate.module.css";

const TelegramBrowserGate = ({ onDevBypass }) => {
  const handleBypass = () => {
    if (onDevBypass) {
      onDevBypass();
    } else {
      enableDevBrowserMode();
    }
  };

  return (
    <div className={styles.gateContainer}>
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.badge}>
          <Smartphone size={14} />
          <span>Telegram Mini App</span>
        </div>

        <img
          src={logoImg}
          alt={BRAND_CONFIG.shortTitle}
          className={styles.logoPreview}
          draggable={false}
        />

        <div className={styles.iconCircle}>
          <Send size={34} style={{ marginLeft: "-2px" }} />
        </div>

        <h1 className={styles.title}>Faqat Telegramda ishlaydi</h1>

        <p className={styles.description}>
          {BRAND_CONFIG.shortTitle} internet-do'koni eng qulay xarid va tezkor
          buyurtmalar uchun Telegram Mini App formatida yaratilgan. Do'konni bot
          orqali oching.
        </p>

        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openTelegramBtn}
        >
          <Send size={18} />
          <span>Telegram orqali ochish</span>
        </a>

        {/* Dasturchi va test qiluvchilar uchun qulay bypass rejimi */}
        <button
          type="button"
          onClick={handleBypass}
          className={styles.devBypassBtn}
        >
          <Code
            size={14}
            style={{ verticalAlign: "middle", marginRight: "4px" }}
          />
          Brauzerda ko'rish (Dasturchi rejimi)
        </button>
      </motion.div>
    </div>
  );
};

export default TelegramBrowserGate;
