"use client";
import Image from "next/image";
import { useState } from "react";
import { brand } from "@/config/brand";
function ImageState({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const placeholder = !src || failed;
  return (
    <div className="product-stage">
      <Image
        src={placeholder ? brand.placeholder : src}
        alt={alt}
        fill
        sizes="(max-width:640px) 100vw, 400px"
        className={placeholder ? "product-placeholder" : "product-image"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
export function ProductImage(props: { src?: string; alt: string }) {
  return <ImageState key={props.src} {...props} />;
}
