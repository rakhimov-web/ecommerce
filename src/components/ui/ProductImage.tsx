"use client";
import Image from "next/image";
import { useState } from "react";
import { brand } from "@/config/brand";
function ImageState({
  src,
  alt,
  fit = "contain",
  mobileSrc,
  aspect = "square",
  priority = false,
}: {
  src?: string;
  alt: string;
  fit?: "contain" | "cover";
  mobileSrc?: string;
  aspect?: "square" | "banner";
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const placeholder =
    failed ||
    ((!src || src === brand.placeholder) &&
      (!mobileSrc || mobileSrc === brand.placeholder));
  return (
    <div
      className={`product-stage ${aspect === "banner" ? "product-stage-banner" : ""}`}
    >
      <picture>
        {mobileSrc && !placeholder && (
          <source media="(max-width:639px)" srcSet={mobileSrc} />
        )}
        <Image
          src={
            placeholder
              ? brand.placeholder
              : (src ?? mobileSrc ?? brand.placeholder)
          }
          alt={alt}
          fill
          priority={priority}
          sizes={
            aspect === "banner"
              ? "(max-width:1440px) 100vw, 1440px"
              : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          }
          className={
            placeholder
              ? "product-placeholder"
              : fit === "cover"
                ? "product-cover"
                : "product-image"
          }
          onError={() => setFailed(true)}
        />
      </picture>
    </div>
  );
}
export function ProductImage(props: {
  src?: string;
  alt: string;
  fit?: "contain" | "cover";
  mobileSrc?: string;
  aspect?: "square" | "banner";
  priority?: boolean;
}) {
  return (
    <ImageState
      key={`${props.src ?? ""}:${props.mobileSrc ?? ""}`}
      {...props}
    />
  );
}
