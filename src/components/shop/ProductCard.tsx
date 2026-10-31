"use client";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { brand } from "@/config/brand";
import type { ProductSummary } from "@/features/catalog/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { PriceBlock } from "@/components/ui/PriceBlock";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
export function ProductCard({
  product,
  liked = false,
  quantity = 0,
  onLike,
  onQuantityChange,
}: {
  product: ProductSummary;
  liked?: boolean;
  quantity?: number;
  onLike?: () => void;
  onQuantityChange?: (value: number) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("ui");
  const name = product.name[locale === "ru" ? "ru" : "uz"] || product.name.uz;
  const available = product.stock > 0;
  return (
    <article className="product-card">
      <div className={`product-card-stage ${available ? "" : "out-of-stock"}`}>
        <Link
          className="product-detail-link"
          href={`/${locale}/p/${product.slug}`}
          aria-label={name}
        >
          <ProductImage src={product.image} alt={name} />
        </Link>
        <div className="product-badge">
          {!available ? (
            <Badge>{t("outOfStock")}</Badge>
          ) : product.badge ? (
            <Badge>{t(product.badge)}</Badge>
          ) : null}
        </div>
        <div className="product-heart">
          <IconButton
            aria-label={t("favorite", { name })}
            aria-pressed={liked}
            onClick={onLike}
            disabled={!onLike}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
          </IconButton>
        </div>
      </div>
      <div className="product-meta">
        <Link
          className="product-title-link"
          href={`/${locale}/p/${product.slug}`}
        >
          <h3 className="type-product-name line-clamp-2 product-name">
            {name}
          </h3>
        </Link>
        {brand.features.reviews && product.rating && (
          <p
            className="rating type-caption-sm"
            aria-label={t("rating", {
              value: product.rating.average,
              count: product.rating.count,
            })}
          >
            <Star size={12} fill="currentColor" aria-hidden="true" />
            {product.rating.average}
            <span className="text-mute">({product.rating.count})</span>
          </p>
        )}
        <PriceBlock
          price={product.price}
          oldPrice={product.oldPrice}
          installment={product.installment}
        />
        {available && product.stock <= 3 && (
          <p className="type-caption-sm text-warning">
            {t("lowStock", { count: product.stock })}
          </p>
        )}
        <div className="product-add">
          {available &&
            (quantity > 0 ? (
              <QuantityStepper
                value={quantity}
                disabled={!onQuantityChange}
                min={0}
                max={Math.min(product.stock, 10)}
                onChange={(value) => onQuantityChange?.(value)}
              />
            ) : (
              <IconButton
                variant="ink"
                disabled={!onQuantityChange}
                aria-label={t("add", { name })}
                onClick={() => onQuantityChange?.(1)}
              >
                <Plus size={24} />
              </IconButton>
            ))}
        </div>
      </div>
    </article>
  );
}
