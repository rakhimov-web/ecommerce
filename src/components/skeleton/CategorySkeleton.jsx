import styles from "./skeleton.module.css";

const CategorySkeleton = () => {
  return (
    <section className={styles.categorySection} aria-label="Kategoriyalar yuklanmoqda">
      <div className={styles.categoryContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className={styles.categoryItem}>
            <div className={`${styles.categoryIcon} ${styles.shimmer}`} />
            <div className={styles.categoryTitleWrap}>
              <div className={`${styles.categoryTitle} ${styles.shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySkeleton;
