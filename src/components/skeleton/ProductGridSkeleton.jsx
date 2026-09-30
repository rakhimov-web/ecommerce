import styles from "./skeleton.module.css";

const ProductGridSkeleton = () => {
  return (
    <section className={styles.productSection} aria-label="Mahsulotlar yuklanmoqda">
      <div className={styles.sectionHeader}>
        <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />
      </div>

      <div className={styles.productGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className={styles.productCard}>
            {/* 2/3 rasm ramkasi */}
            <div className={`${styles.imageSkeleton} ${styles.shimmer}`} />

            {/* Matn va narx skeleti */}
            <div className={styles.productContent}>
              <div className={`${styles.priceSkeleton} ${styles.shimmer}`} />
              <div className={`${styles.nameSkeleton} ${styles.shimmer}`} />
              <div className={`${styles.descLine1} ${styles.shimmer}`} />
              <div className={`${styles.descLine2} ${styles.shimmer}`} />
              <div className={`${styles.buttonSkeleton} ${styles.shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGridSkeleton;
