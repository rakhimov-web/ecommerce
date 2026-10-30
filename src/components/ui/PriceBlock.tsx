import { useTranslations } from "next-intl";
import { brand } from "@/config/brand";
import { formatPrice } from "@/lib/formatPrice";
import { discountPercent } from "@/lib/discountPercent";
export function PriceBlock({
  price,
  oldPrice,
  size = "md",
  installment,
}: {
  price: number;
  oldPrice?: number;
  size?: "md" | "lg";
  installment?: { monthly: number; months: number };
}) {
  const t = useTranslations("ui");
  const discount =
    oldPrice === undefined ? 0 : discountPercent(price, oldPrice);
  return (
    <div className="price-block">
      <div
        className={`type-price-${size} price-current ${discount ? "text-sale" : ""}`}
      >
        {formatPrice(price)}
      </div>
      {discount > 0 && (
        <div className="price-history type-caption-sm">
          <del className="text-mute">{formatPrice(oldPrice ?? price)}</del>
          <span className="text-sale">−{discount}%</span>
        </div>
      )}
      {brand.features.installment && installment && (
        <p className="type-caption-sm text-mute price-current">
          {t("installment", {
            amount: formatPrice(installment.monthly),
            months: installment.months,
          })}
        </p>
      )}
    </div>
  );
}
