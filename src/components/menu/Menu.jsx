import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge";
import { useApp } from "../../context/useApp";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./menu.module.css";

const itemWidthPercent = 25; // 100 / 4

const Menu = ({ active: controlledActive, onTabChange, cartCount: propCartCount }) => {
  const { totalCartCount } = useApp();
  const cartCount = propCartCount !== undefined ? propCartCount : totalCartCount;
  const [internalActive, setInternalActive] = useState(0);
  const active =
    controlledActive !== undefined ? controlledActive : internalActive;

  const items = [
    { id: 0, label: "Bosh sahifa", Icon: Home },
    { id: 1, label: "Qidirish", Icon: Search },
    { id: 2, label: "Savatcha", Icon: ShoppingCart, badge: cartCount },
    { id: 3, label: "Profil", Icon: User },
  ];

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
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={styles.iconSvg}
                  />

                  {/* Savatcha bildirishnoma belgisi (badge) */}
                  <NotificationBadge
                    count={item.badge}
                    className={styles.menuBadge}
                  />
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
