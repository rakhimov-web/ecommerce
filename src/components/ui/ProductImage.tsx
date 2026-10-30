"use client";
import { useState } from "react";
import Image from "next/image";
import { brand } from "@/config/brand";
export function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const fallback = !src || failed;
  return (
    <div className="relative aspect-square bg-soft-cloud">
      <Image
        src={fallback ? brand.placeholder : src}
        alt={alt}
        fill
        sizes="(max-width:640px) 100vw, 400px"
        className={
          fallback ? "object-contain p-[30%]" : "object-contain p-[10%]"
        }
        onError={() => setFailed(true)}
      />
    </div>
  );
}
