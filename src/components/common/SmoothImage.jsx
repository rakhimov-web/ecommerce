import { useState, useRef, useEffect } from "react";
import styles from "./smoothImage.module.css";

/**
 * SmoothImage — Apple & High-End E-commerce darajasidagi progressiv rasm komponenti.
 * Rasm yuklangunicha nozik shimmering placeholder ko'rsatadi, rasm kelgach
 * smooth blur-up fade-in animatsiyasi orqali silliq namoyon bo'ladi.
 */
const SmoothImage = ({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  loading = "lazy",
  draggable = false,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // Keshdagi rasmlar allaqachon tayyor bo'lsa darhol loaded holatga o'tkazish
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      {/* Orqa fondagi shaffof shimmer placeholder */}
      <div
        className={`${styles.placeholder} ${
          isLoaded ? styles.placeholderHidden : ""
        }`}
        aria-hidden="true"
      />

      {/* Asosiy rasm (Blurry to Sharp smooth reveal) */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={draggable}
        onLoad={handleLoad}
        className={`${styles.image} ${isLoaded ? styles.imageLoaded : ""} ${className}`}
        {...props}
      />
    </div>
  );
};

export default SmoothImage;
