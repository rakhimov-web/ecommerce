import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import styles from "./menu.module.css";

const items = [
  { id: 0, icon: <Home size={22} />, label: "Bosh sahifa" },
  { id: 1, icon: <Search size={22} />, label: "Qidirish" },
  { id: 2, icon: <ShoppingCart size={22} />, label: "Savatcha" },
  { id: 3, icon: <User size={22} />, label: "Profil" },
];

const itemWidthPercent = 100 / items.length; // 25%

const Menu = () => {
  // Sayt ochilganda qat'iy ravishda 0-indeks (Bosh sahifa) tanlangan bo'ladi
  const [active, setActive] = useState(0);

  return (
    <div className={styles.cover}>
      <nav className={styles.menu}>
        {items.map((item, index) => {
          const isActive = active === index;
          return (
            <button
              key={item.id}
              onClick={() => setActive(index)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              type="button"
            >
              <span className={styles.iconWrapper}>{item.icon}</span>
              <p className={styles.label}>{item.label}</p>
            </button>
          );
        })}

        {/* Sliding Active Indicator: initial={false} sayt ochilganda ortiqcha animatsiyasiz darhol Bosh sahifada turishini ta'minlaydi */}
        <motion.div
          initial={false}
          animate={{
            left: `${active * itemWidthPercent}%`,
            width: `${itemWidthPercent}%`,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className={styles.indicator}
        />
      </nav>
    </div>
  );
};

export default Menu;
