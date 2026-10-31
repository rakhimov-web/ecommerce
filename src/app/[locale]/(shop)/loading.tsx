import { Skeleton } from "@/components/ui/Skeleton";
import { ProductGridSkeleton } from "@/components/shop/ProductGridSkeleton";
export default function Loading() {
  return (
    <main className="home-page home-loading" aria-busy="true">
      <Skeleton className="banner-loading" />
      <div className="category-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="category-loading-item" key={i}>
            <Skeleton className="category-loading" />
            <Skeleton />
          </div>
        ))}
      </div>
      <div className="chip-row home-chips">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton className="chip-loading" key={i} />
        ))}
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <section className="home-section" key={i} aria-hidden="true">
          <Skeleton className="mb-xl" />
          <ProductGridSkeleton layout="rail" />
        </section>
      ))}
      <Skeleton className="home-section mb-xl" />
      <ProductGridSkeleton count={8} />
      <div className="home-section contact-block" aria-hidden="true">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </main>
  );
}
