import { Skeleton } from "@/components/ui/Skeleton";
export function ProductGridSkeleton({
  count = 4,
  layout = "grid",
}: {
  count?: number;
  layout?: "grid" | "rail";
}) {
  return (
    <div
      className={`${layout === "rail" ? "product-rail" : "product-grid"} skeleton-grid`}
      aria-hidden="true"
    >
      {Array.from({ length: Math.min(Math.max(count, 0), 8) }, (_, i) => (
        <div className="product-meta" key={i}>
          <Skeleton className="gallery-skeleton" />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ))}
    </div>
  );
}
