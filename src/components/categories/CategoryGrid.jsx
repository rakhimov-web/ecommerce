import { memo } from "react";
import SmoothImage from "../common/SmoothImage";
import { CATEGORIES } from "../../data/categories";
import styles from "./categoryGrid.module.css";

const CategoryGrid = ({ onCategoryClick }) => {
  const handleClick = (e, cat) => {
    e.preventDefault();
    if (onCategoryClick) {
      onCategoryClick(cat.title);
    }
  };

  return (
    <section className={styles.section} aria-label="Asosiy kategoriyalar">
      <div className={styles.gridContainer}>
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.id}`}
            className={styles.categoryItem}
            onClick={(e) => handleClick(e, cat)}
          >
            <div className={styles.iconWrapper}>
              <SmoothImage
                src={cat.icon}
                alt={cat.title}
                className={styles.categoryIcon}
                draggable={false}
              />
            </div>
            <span className={styles.categoryTitle}>{cat.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default memo(CategoryGrid);
