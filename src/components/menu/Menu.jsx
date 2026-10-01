import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge";
import { useApp } from "../../context/useApp";
import { triggerHaptic } from "../../lib/telegram";
import styles from "./menu.module.css";

const Menu = ({
  active: controlledActive,
  onTabChange,
  cartCount: propCartCount,
}) => {
  const { totalCartCount } = useApp();
  const cartCount =
    propCartCount !== undefined ? propCartCount : totalCartCount;
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
        {/*
          Scroll-proof yagona gorizontal sirpanuvchi kapsula:
          layoutId va DOM o'lchovlariga bog'lanmagan, shuning uchun sahifa
          qanchalik scroll qilinganidan qat'i nazar mutlaqo Y o'qida sakramaydi
          va faqat X o'qi bo'yicha "ship" etib silliq o'tadi.
        */}
        <div className={styles.pillTrack} aria-hidden="true">
          <motion.div
            className={styles.activeCapsule}
            initial={false}
            animate={{
              x: `${active * 100}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 460,
              damping: 34,
              mass: 0.6,
            }}
          >
            <div className={styles.pillShapeBox}>
              <div className={styles.pillShape} />
            </div>
            <div className={styles.pillLabelSpacer} />
          </motion.div>
        </div>

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
              {/* Ikonka maydoni */}
              <div className={styles.iconContainer}>
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
      </nav>
    </div>
  );
};

export default Menu;
