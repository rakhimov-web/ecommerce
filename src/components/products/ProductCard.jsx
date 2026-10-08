import { useState, memo } from "react";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import TicketBadge from "./TicketBadge";
import SmoothImage from "../common/SmoothImage";
import Button from "../common/Button";
import styles from "./productGrid.module.css";
import { formatPrice } from "../../data/products";
import { useApp } from "../../context/useApp";

const ProductCard = ({ product }) => {
  const {
    getCartQuantity,
    addToCart,
    updateCartQuantity,
    isLiked: checkIsLiked,
    toggleLike: handleToggleLikeContext,
  } = useApp();

  const quantity = getCartQuantity(product.id);
  const isLiked = checkIsLiked(product.id);

  const [isAdding, setIsAdding] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    handleToggleLikeContext(product.id);
  };

  const handleInitialAddToCart = (e) => {
    e.stopPropagation();
    if (isAdding || quantity > 0) return;

    setIsAdding(true);
    setTimeout(() => {
      addToCart(product.id);
      setIsAdding(false);
    }, 320);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateCartQuantity(product.id, -1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateCartQuantity(product.id, 1);
  };

  return (
    <article className={styles.card}>
      {/* 3/4 rasm freymi - 1:1 dan balandroq, 2:3 kabi haddan tashqari uzun bo'lmagan optimal nisbat */}
      <div className={styles.imageContainer}>
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
            fill={isLiked ? "var(--error)" : "none"}
            stroke={isLiked ? "var(--error)" : "currentColor"}
            strokeWidth={1.8}
          />
        </button>

        {/* Silliq qirqilgan ichki rasm maydoni */}
        <div className={styles.imageWrapper}>
          <SmoothImage
            src={product.image}
            alt={product.title}
            className={styles.productImage}
            draggable={false}
          />
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

        {/* Savatga qo'shish yoki Miqdor boshqaruvi (Balandlik va kenglik har doim 100% bir xil) */}
        <div className={styles.actionContainer}>
          {quantity > 0 ? (
            <div
              className={styles.stepperContainer}
              onClick={(e) => e.stopPropagation()}
              role="group"
              aria-label={`${product.title} miqdori`}
            >
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={handleDecrement}
                aria-label="Bir dona kamaytirish"
              >
                <Minus size={15} strokeWidth={2.4} />
              </button>

              <span className={styles.stepperCount} aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                className={styles.stepperBtn}
                onClick={handleIncrement}
                aria-label="Bir dona oshirish"
              >
                <Plus size={15} strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <Button
              fullWidth
              variant="primary"
              isLoading={isAdding}
              icon={<ShoppingCart size={16} strokeWidth={2} />}
              onClick={handleInitialAddToCart}
              aria-label={`${product.title}ni savatga qo'shish`}
              className={styles.cartButton}
            >
              Savatga
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
