"use client";
import Image from "next/image";
import { useState } from "react";
import { brand } from "@/config/brand";
function ImageState({
  src,
  alt,
  fit = "contain",
}: {
  src?: string;
  alt: string;
  fit?: "contain" | "cover";
}) {
  const [failed, setFailed] = useState(false);
  const placeholder = !src || failed;
  return (
    <div className="product-stage">
      <Image
        src={placeholder ? brand.placeholder : src}
        alt={alt}
        fill
        sizes="(max-width:640px) 100vw, 400px"
        className={
          placeholder
            ? "product-placeholder"
            : fit === "cover"
              ? "product-cover"
              : "product-image"
        }
        onError={() => setFailed(true)}
      />
    </div>
  );
}
export function ProductImage(props: {
  src?: string;
  alt: string;
  fit?: "contain" | "cover";
}) {
  return <ImageState key={props.src} {...props} />;
}
