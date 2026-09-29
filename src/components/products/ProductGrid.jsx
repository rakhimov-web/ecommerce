import { useState, useRef } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import TicketBadge from "./TicketBadge";
import styles from "./productGrid.module.css";

import prodIphone from "../../assets/products/prod_iphone.jpg";
import prodMacbook from "../../assets/products/prod_macbook.jpg";
import prodIpad from "../../assets/products/prod_ipad.jpg";
import prodWatch from "../../assets/products/prod_watch.jpg";
import prodAirpods from "../../assets/products/prod_airpods.jpg";

const productsData = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro",
    description: "128GB, Natural Titanium, Super Retina XDR ekran, A17 Pro kuchli protsessor",
    price: 14490000,
    oldPrice: 15990000,
    image: prodIphone,
    badge: "yangi",
  },
  {
    id: 2,
    title: "Apple MacBook Pro 16",
    description: "M3 Max chip, 36GB RAM, 1TB SSD, Liquid Retina XDR displey, Space Black rang",
    price: 36800000,
    oldPrice: 39500000,
    image: prodMacbook,
    badge: null,
  },
  {
    id: 3,
    title: "Apple iPad Pro 11 M4",
    description: "Ultra Retina XDR OLED, 256GB, Wi-Fi, Space Black, Apple Pencil Pro qo'llab-quvvatlaydi",
    price: 12900000,
    oldPrice: 13800000,
    image: prodIpad,
    badge: "yangi",
  },
  {
    id: 4,
    title: "Apple Watch Ultra 2",
    description: "49mm Titanium Case, Midnight Ocean Band, GPS + Cellular, suvga chidamli 100m",
    price: 9990000,
    oldPrice: 10800000,
    image: prodWatch,
    badge: "aksiya",
  },
  {
    id: 5,
    title: "Apple AirPods Pro 2",
    description: "MagSafe Case (USB-C), Faol shovqinni bekor qilish (ANC), Shaxsiy fazoviy audio",
    price: 2890000,
    oldPrice: 3200000,
    image: prodAirpods,
    badge: "aksiya",
  },
  {
    id: 6,
    title: "Apple iPhone 15 Pro Max",
    description: "256GB, Blue Titanium, 5x optik zoom, titan korpus, Dynamic Island interfeysi",
    price: 16200000,
    oldPrice: 17500000,
    image: prodIphone,
    badge: null,
  },
  {
    id: 7,
    title: "Apple MacBook Air 15",
    description: "M3 chip, 16GB RAM, 512GB SSD, yupqa va yengil alyuminiy korpus, Silver",
    price: 18500000,
    oldPrice: 19900000,
    image: prodMacbook,
    badge: "yangi",
  },
  {
    id: 8,
    title: "Apple iPad Air 13 M2",
    description: "Katta 13 dyuymli Liquid Retina ekran, 128GB, Starlight, butun kunlik quvvat",
    price: 10400000,
    oldPrice: 11200000,
    image: prodIpad,
    badge: null,
  },
  {
    id: 9,
    title: "Apple Watch Series 9",
    description: "45mm Midnight alyuminiy korpus, Sport Band, S9 chip, Double Tap jesti",
    price: 5400000,
    oldPrice: 5900000,
    image: prodWatch,
    badge: "aksiya",
  },
  {
    id: 10,
    title: "Apple AirPods Max",
    description: "Simsiz Premium Over-Ear naushnik, High-Fidelity Audio, Faol shovqin to'sish tizimi",
    price: 6800000,
    oldPrice: 7400000,
    image: prodAirpods,
    badge: null,
  },
  {
    id: 11,
    title: "Apple iPhone 15",
    description: "128GB, Qora rang, 48MP asosiy kamera, Dynamic Island, A16 Bionic protsessor",
    price: 10200000,
    oldPrice: 11100000,
    image: prodIphone,
    badge: "aksiya",
  },
  {
    id: 12,
    title: "Apple MacBook Pro 14",
    description: "M3 Pro chip, 18GB RAM, 512GB SSD, ProMotion 120Hz displey, Space Black",
    price: 26500000,
    oldPrice: 28500000,
    image: prodMacbook,
    badge: "yangi",
  },
];

// O'zbekiston so'm narx formati (masalan: "14 490 000 so'm")
const formatPrice = (amount) => {
  return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
};

const ProductGrid = () => {
  const [likes, setLikes] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [btnRipples, setBtnRipples] = useState([]);
  const [imgRipples, setImgRipples] = useState([]);

  const rippleCounter = useRef(0);

  // Like tugmasi
  const toggleLike = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Savatga qo'shish va suv to'lqini animatsiyasi
  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;

    setBtnRipples((prev) => [...prev, { id: rippleId, targetId: id, x: rippleX, y: rippleY }]);

    // Savatga qo'shilganlik holati (1.5 soniyalik visual feedback)
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1500);

    setTimeout(() => {
      setBtnRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  // Rasmga bosilganda bannerdagi kabi sayoz to'lqin effekti
  const handleImagePointerDown = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX =
      (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2) - rect.left;
    const rippleY =
      (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height / 2) - rect.top;

    rippleCounter.current += 1;
    const rippleId = rippleCounter.current;

    setImgRipples((prev) => [...prev, { id: rippleId, targetId: id, x: rippleX, y: rippleY }]);

    setTimeout(() => {
      setImgRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  return (
    <section className={styles.section} aria-label="Tavsiya qilingan mahsulotlar">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Tavsiya qilamiz</h2>
      </div>

      <div className={styles.grid}>
        {productsData.map((product) => {
          const isLiked = !!likes[product.id];
          const isAdded = !!addedItems[product.id];
          const currentBtnRipples = btnRipples.filter((r) => r.targetId === product.id);
          const currentImgRipples = imgRipples.filter((r) => r.targetId === product.id);

          return (
            <article key={product.id} className={styles.card}>
              {/* 3/4 rasm freymi - nozik, silliq hoshiya FAQAT shu rasm ramkasida */}
              <div
                className={styles.imageContainer}
                onPointerDown={(e) => handleImagePointerDown(e, product.id)}
              >
                {/* Maxsus 3D chipta (ticket coupon) badge - Aksiya va Yangi */}
                {product.badge && <TicketBadge type={product.badge} />}

                {/* Sevimlilar (Like) yurakcha tugmasi */}
                <button
                  type="button"
                  className={`${styles.favoriteBtn} ${isLiked ? styles.liked : ""}`}
                  onClick={(e) => toggleLike(e, product.id)}
                  aria-label={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
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

                  {/* Bannerdagi kabi sayoz to'lqin (ripple) */}
                  {currentImgRipples.map((ripple) => (
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
                  <div className={styles.currentPrice}>{formatPrice(product.price)}</div>
                  {product.oldPrice && (
                    <div className={styles.oldPrice}>{formatPrice(product.oldPrice)}</div>
                  )}
                </div>

                <h3 className={styles.productTitle}>{product.title}</h3>

                <p className={styles.productDescription} title={product.description}>
                  {product.description}
                </p>

                {/* Karta kengligi bilan teng (width: 100%) Savatga tugmasi */}
                <button
                  type="button"
                  className={`${styles.cartButton} ${isAdded ? styles.addedButton : ""}`}
                  onClick={(e) => handleAddToCart(e, product.id)}
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

                  {/* Bannerdagi suv yoyiladigan ripple effekti */}
                  {currentBtnRipples.map((ripple) => (
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
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
