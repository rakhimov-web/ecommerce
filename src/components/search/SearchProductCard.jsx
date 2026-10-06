import { useState } from "react";
import { Heart, Star, MessageSquare } from "lucide-react";
import { formatPrice } from "../../data/products";
import styles from "./searchProductCard.module.css";

const SearchProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked((prev) => !prev);
  };

  // Chegirma foizini hisoblash
  const discountPercent =
    product.oldPrice && product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <article className={styles.card}>
      {/* 3-ustunli ixcham rasm konteyneri */}
      <div className={styles.imageContainer}>
        {/* Aksiya yoki Yangi badge */}
        {product.badge && (
          <span
            className={`${styles.badge} ${
              product.badge === "aksiya" ? styles.badgeSale : styles.badgeNew
            }`}
          >
            {product.badge.toUpperCase()}
          </span>
        )}

        {/* Yurakcha (Like) tugmasi */}
        <button
          type="button"
          onClick={toggleLike}
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
          aria-label={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart
            size={15}
            fill={isLiked ? "var(--error)" : "none"}
            stroke={isLiked ? "var(--error)" : "currentColor"}
            strokeWidth={2}
          />
        </button>

        {/* Asosiy rasm */}
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      {/* Narx va ma'lumotlar bloki */}
      <div className={styles.details}>
        {/* Hozirgi narx */}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Eski narx va chegirma foizi */}
        {product.oldPrice && (
          <div className={styles.oldPriceRow}>
            <span className={styles.oldPrice}>
              {formatPrice(product.oldPrice)}
            </span>
            {discountPercent && (
              <span className={styles.discountBadge}>↓{discountPercent}%</span>
            )}
          </div>
        )}

        {/* Bo'lib to'lash (oyma-oy) sariq badge */}
        {product.monthlyPrice && (
          <div className={styles.installmentBadge}>
            <span>{product.monthlyPrice} so'mdan</span>
          </div>
        )}

        {/* Mahsulot nomi (2 qatorda) */}
        <h4 className={styles.title} title={product.title}>
          {product.title}
        </h4>

        {/* Reyting va izohlar soni */}
        <div className={styles.ratingRow}>
          <span className={styles.ratingStar}>
            <Star size={12} fill="var(--warning)" stroke="var(--warning)" />
            <span>{product.rating || "4.8"}</span>
          </span>
          <span className={styles.reviewCount}>
            <MessageSquare size={11} className={styles.chatIcon} />
            <span>{product.reviews || "12"}</span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default SearchProductCard;
