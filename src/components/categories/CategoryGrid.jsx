import { useState, useRef } from "react";
import styles from "./categoryGrid.module.css";

import telefonImg from "../../assets/categories/telefon.png";
import noutbukImg from "../../assets/categories/noutbuk.png";
import ipadImg from "../../assets/categories/ipad.png";
import watchImg from "../../assets/categories/apple-watch.png";
import aksessuarlarImg from "../../assets/categories/aksessuarlar.png";

const categories = [
  { id: "telefon", title: "Telefon", icon: telefonImg, link: "/category/telefon" },
  { id: "noutbuk", title: "Noutbuk", icon: noutbukImg, link: "/category/noutbuk" },
  { id: "ipad", title: "iPad", icon: ipadImg, link: "/category/ipad" },
  { id: "apple-watch", title: "Apple Watch", icon: watchImg, link: "/category/apple-watch" },
  { id: "aksessuarlar", title: "Aksessuarlar", icon: aksessuarlarImg, link: "/category/aksessuarlar" },
];

const CategoryGrid = ({ onCategoryClick }) => {
  const [ripples, setRipples] = useState([]);
  const rippleCounter = useRef(0);

  const handleClick = (e, cat) => {
    e.preventDefault();
    if (onCategoryClick) {
      onCategoryClick(cat.title);
    }
  };

  const handlePointerDown = (e, catId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;

    const newRipple = {
      id: rippleId,
      catId,
      x: rippleX,
      y: rippleY,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  return (
    <section className={styles.section} aria-label="Asosiy kategoriyalar">
      <div className={styles.gridContainer}>
        {categories.map((cat) => {
          const catRipples = ripples.filter((r) => r.catId === cat.id);
          return (
            <a
              key={cat.id}
              href={cat.link}
              className={styles.categoryItem}
              onClick={(e) => handleClick(e, cat)}
              onPointerDown={(e) => handlePointerDown(e, cat.id)}
            >
              <div className={styles.iconWrapper}>
                <img
                  src={cat.icon}
                  alt={cat.title}
                  className={styles.categoryIcon}
                  draggable={false}
                />
                {/* Bannerdagi kabi iOS-uslubidagi sayoz to'lqin (ripple) effekti */}
                {catRipples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className={styles.ripple}
                    style={{
                      left: `${ripple.x}px`,
                      top: `${ripple.y}px`,
                    }}
                  />
                ))}
                {/* Bosilgandagi mayin nur yoyilishi */}
                <div className={styles.pressHighlight} />
              </div>
              <span className={styles.categoryTitle}>{cat.title}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
