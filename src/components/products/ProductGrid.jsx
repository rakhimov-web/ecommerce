import ProductCard from "./ProductCard";
import styles from "./productGrid.module.css";
import { productsData } from "../../data/products";

const ProductGrid = () => {
  return (
    <section className={styles.section} aria-label="Tavsiya qilingan mahsulotlar">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Tavsiya qilamiz</h2>
      </div>

      <div className={styles.grid}>
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
