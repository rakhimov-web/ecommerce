import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./menu.module.css";

const items = [
  { id: 0, label: "Bosh sahifa", Icon: Home },
  { id: 1, label: "Qidirish", Icon: Search },
  { id: 2, label: "Savatcha", Icon: ShoppingCart, badge: 2 },
  { id: 3, label: "Profil", Icon: User },
];

const itemWidthPercent = 100 / items.length; // 25%

const Menu = ({ active: controlledActive, onTabChange }) => {
  const [internalActive, setInternalActive] = useState(0);
  const active =
    controlledActive !== undefined ? controlledActive : internalActive;

  const handleSelect = (index) => {
    triggerHaptic("selection");
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActive(index);
    }
  };

  return (
    <div className={styles.cover}>
      <nav className={styles.menu}>
        {items.map((item, index) => {
          const isActive = active === index;
          const Icon = item.Icon;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(index)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              type="button"
              aria-label={item.label}
            >
              {/* Ikonka maydoni va orqa fondagi silliq harakatlanuvchi kapsula (active pill) */}
              <div className={styles.iconContainer}>
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className={styles.activeCapsule}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}

                <span className={styles.iconWrapper}>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className={styles.iconSvg}
                  />

                  {/* Savatcha bildirishnoma belgisi (badge) */}
                  {item.badge !== undefined && (
                    <span className={styles.tabBadge}>{item.badge}</span>
                  )}
                </span>
              </div>

              {/* Tab yorlig'i matni — sakrashsiz, barqaror */}
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}

        {/* 
          Yuqoridagi silliq suzuvchi neon indikator (Top Floating Pill & Ambient Glow):
          To'liq enli qattiq chiziq emas, balki markazlashgan, yumaloq va nurli premium pill
        */}
        <motion.div
          className={styles.topIndicatorTrack}
          initial={false}
          animate={{
            left: `${active * itemWidthPercent}%`,
            width: `${itemWidthPercent}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 32,
            mass: 0.8,
          }}
        >
          <div className={styles.topIndicatorPill} />
          <div className={styles.topIndicatorAura} />
        </motion.div>
      </nav>
    </div>
  );
};

export default Menu;
