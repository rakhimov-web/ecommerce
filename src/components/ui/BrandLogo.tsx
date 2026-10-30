import Image from "next/image";
import { brand } from "@/config/brand";
// SVG <img> documents cannot inherit next/font. Keep its supplied mark, and
// render the configured wordmark with our local Oswald instead of clipped Arial.
export function BrandLogo() {
  return (
    <span className="brand-logo" role="img" aria-label={brand.name}>
      <span className="brand-mark" aria-hidden="true">
        <Image src={brand.logo} alt="" width={232} height={48} priority />
      </span>
      <span className="brand-wordmark" aria-hidden="true">
        {brand.name}
      </span>
    </span>
  );
}
