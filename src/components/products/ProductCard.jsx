import { useState, useRef } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import TicketBadge from "./TicketBadge";
import styles from "./productGrid.module.css";
import { formatPrice } from "../../data/products";

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [btnRipples, setBtnRipples] = useState([]);
  const [imgRipples, setImgRipples] = useState([]);
  const rippleCounter = useRef(0);

  const toggleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked((prev) => !prev);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX ||
        (e.touches && e.touches[0].clientX) ||
        rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY ||
        (e.touches && e.touches[0].clientY) ||
        rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;
    setBtnRipples((prev) => [
      ...prev,
      { id: rippleId, x: rippleX, y: rippleY },
    ]);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);

    setTimeout(() => {
      setBtnRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  const handleImagePointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX ||
        (e.touches && e.touches[0].clientX) ||
        rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY ||
        (e.touches && e.touches[0].clientY) ||
        rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;
    setImgRipples((prev) => [
      ...prev,
      { id: rippleId, x: rippleX, y: rippleY },
    ]);

    setTimeout(() => {
      setImgRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  return (
    <article className={styles.card}>
      {/* 3/4 rasm freymi - 1:1 dan balandroq, 2:3 kabi haddan tashqari uzun bo'lmagan optimal nisbat */}
      <div
        className={styles.imageContainer}
        onPointerDown={handleImagePointerDown}
      >
        {/* 3D Ticket Coupon Badge */}
        {product.badge && <TicketBadge type={product.badge} />}

        {/* Sevimlilar (Like) yurakcha tugmasi */}
        <button
          type="button"
          className={`${styles.favoriteBtn} ${isLiked ? styles.liked : ""}`}
          onClick={toggleLike}
          aria-label={
            isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"
          }
        >
          <Heart
            size={17}
            fill={isLiked ? "#ef4444" : "none"}
            stroke={isLiked ? "#ef4444" : "currentColor"}
            strokeWidth={2}
          />
        </button>

        {/* Silliq qirqilgan ichki rasm maydoni */}
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
            draggable={false}
          />
          {imgRipples.map((ripple) => (
            <span
              key={ripple.id}
              className={styles.imageRipple}
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
              }}
            />
          ))}
          <div className={styles.imageHighlight} />
        </div>
      </div>

      {/* Ma'lumot qismi: Narx, Nomi, Tavsifi va Savat tugmasi */}
      <div className={styles.content}>
        <div className={styles.priceBlock}>
          <div className={styles.currentPrice}>
            {formatPrice(product.price)}
          </div>
          {product.oldPrice && (
            <div className={styles.oldPrice}>
              {formatPrice(product.oldPrice)}
            </div>
          )}
        </div>

        <h3 className={styles.productTitle}>{product.title}</h3>

        <p className={styles.productDescription} title={product.description}>
          {product.description}
        </p>

        {/* Savatga qo'shish tugmasi */}
        <button
          type="button"
          className={`${styles.cartButton} ${isAdded ? styles.addedButton : ""}`}
          onClick={handleAddToCart}
          aria-label={`${product.title}ni savatga qo'shish`}
        >
          {isAdded ? (
            <>
              <Check size={16} strokeWidth={2.5} />
              <span>Qo'shildi</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} strokeWidth={2} />
              <span>Savatga</span>
            </>
          )}

          {btnRipples.map((ripple) => (
            <span
              key={ripple.id}
              className={styles.buttonRipple}
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
              }}
            />
          ))}
          <div className={styles.pressHighlight} />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
