import styles from "./skeleton.module.css";

const BannerSkeleton = () => {
  return (
    <section className={styles.bannerSection} aria-label="Banner yuklanmoqda">
      <div className={`${styles.bannerCard} ${styles.shimmer}`} />
      <div className={styles.bannerPagination}>
        <div className={`${styles.dotActive} ${styles.shimmer}`} />
        <div className={`${styles.dotSmall} ${styles.shimmer}`} />
        <div className={`${styles.dotSmall} ${styles.shimmer}`} />
      </div>
    </section>
  );
};

export default BannerSkeleton;
