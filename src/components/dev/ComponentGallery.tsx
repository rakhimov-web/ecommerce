"use client";
import { GalleryButtonStates as States } from "./GalleryButtonStates";
import { GalleryFields as Fields } from "./GalleryFields";
import { TokenGallery } from "./TokenGallery";
import { AnimatePresence } from "motion/react";
import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { PackageOpen } from "lucide-react";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import { brand } from "@/config/brand";
import { demoProducts } from "@/server/repositories/mock/products";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TextField } from "@/components/ui/TextField";
import { Badge } from "@/components/ui/Badge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Accordion } from "@/components/ui/Accordion";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Toast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceBlock } from "@/components/ui/PriceBlock";
import { ProductImage } from "@/components/ui/ProductImage";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ProductCard } from "@/components/shop/ProductCard";
import { BottomTabBar } from "@/components/shop/BottomTabBar";
import { BackBar } from "@/components/shop/BackBar";
import { UtilityBar } from "@/components/shop/UtilityBar";
import { PrimaryNav } from "@/components/shop/PrimaryNav";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
function Feedback() {
  const t = useTranslations("ui");
  const [quantity, setQuantity] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const closeToast = useCallback(() => setToast(false), []);
  return (
    <section className="gallery-section">
      <h2 className="type-heading-lg">{t("feedback")}</h2>
      <div className="gallery-controls">
        <div className="gallery-state">
          <div className="gallery-actions">
            <Badge>{t("new")}</Badge>
            <Badge>{t("sale")}</Badge>
          </div>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={3}
          />
          <QuantityStepper value={3} onChange={() => {}} disabled />
          <Accordion title={t("details")}>{t("detailsCopy")}</Accordion>
          <Accordion title={t("details")} defaultOpen>
            {t("detailsCopy")}
          </Accordion>
        </div>
        <div className="gallery-state">
          <Skeleton className="gallery-skeleton" />
          <Skeleton />
          <Skeleton />
        </div>
        <div className="gallery-state">
          <div className="empty-state">
            <PackageOpen size={64} aria-hidden="true" />
            <h3 className="type-heading-lg">{t("empty")}</h3>
            <p>{t("emptyCopy")}</p>
          </div>
        </div>
        <div className="gallery-state">
          <Button onClick={() => setSheet(true)}>{t("openSheet")}</Button>
          <Button variant="secondary" onClick={() => setToast(true)}>
            {t("showToast")}
          </Button>
        </div>
      </div>
      <BottomSheet title={t("sheetTitle")} open={sheet} onClose={closeSheet}>
        <TextField label={t("fieldLabel")} />
        <p className="my-xl">{t("detailsCopy")}</p>
        <Button onClick={closeSheet}>{t("confirm")}</Button>
      </BottomSheet>
      <AnimatePresence>
        {toast && <Toast message={t("toastMessage")} onClose={closeToast} />}
      </AnimatePresence>
    </section>
  );
}
function Products() {
  const t = useTranslations("ui");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  return (
    <>
      <section className="gallery-section">
        <h2 className="type-heading-lg">{t("price")}</h2>
        <div className="gallery-actions">
          <PriceBlock price={1250000} />
          <PriceBlock
            price={1250000}
            oldPrice={1900000}
            size="lg"
            installment={{ monthly: 125000, months: 12 }}
          />
        </div>
      </section>
      <section className="gallery-section">
        <h2 className="type-heading-lg">{t("images")}</h2>
        <div className="gallery-controls">
          <ProductImage alt={t("sample")} />
          <ProductImage src="/missing-gallery-image.webp" alt={t("sample")} />
          <ProductImage src={brand.placeholder} alt={t("banner")} fit="cover" />
        </div>
        <ProductImage alt={t("banner")} aspect="banner" fit="cover" />
        <ProductImage
          src={brand.placeholder}
          mobileSrc={brand.placeholder}
          alt={t("banner")}
          aspect="banner"
          fit="cover"
        />
      </section>
      <section className="gallery-section">
        <h2 className="type-heading-lg">{t("products")}</h2>
        <div className="product-grid">
          {demoProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] ?? 0}
              liked={likes[product.id] ?? false}
              onLike={() =>
                setLikes((prev) => ({
                  ...prev,
                  [product.id]: !prev[product.id],
                }))
              }
              onQuantityChange={(value) =>
                setQuantities((prev) => ({ ...prev, [product.id]: value }))
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}
function Shells() {
  const t = useTranslations("ui");
  const locale = useLocale();
  return (
    <section className="gallery-section">
      <h2 className="type-heading-lg">{t("shells")}</h2>
      <div className="gallery-sticky-sample">
        <Header locale={locale} />
        <BottomTabBar pathname={`/${locale}/catalog`} cartCount={3} />
        <BackBar title={t("about")} onBack={() => {}} />
        <div className="desktop-only">
          <UtilityBar />
          <PrimaryNav cartCount={3} />
          <Footer />
        </div>
      </div>
    </section>
  );
}
function Contents({ onLocale }: { onLocale: (value: "uz" | "ru") => void }) {
  const t = useTranslations("ui");
  const locale = useLocale();
  return (
    <main lang={locale}>
      <header className="gallery-nav">
        <h1 className="type-heading-xl">{t("gallery")}</h1>
        <div className="gallery-actions">
          <Chip active={locale === "uz"} onClick={() => onLocale("uz")}>
            {t("uz")}
          </Chip>
          <Chip active={locale === "ru"} onClick={() => onLocale("ru")}>
            {t("ru")}
          </Chip>
          <Link className="py-md" href={`/${locale}`}>
            {t("navigation")}
          </Link>
        </div>
      </header>
      <div lang="uz">
        <NextIntlClientProvider locale="uz" messages={uz}>
          <States />
        </NextIntlClientProvider>
      </div>
      <div lang="ru">
        <NextIntlClientProvider locale="ru" messages={ru}>
          <States />
        </NextIntlClientProvider>
      </div>
      <Fields />
      <Feedback />
      <Products />
      <Shells />
      <TokenGallery />
    </main>
  );
}
export function ComponentGallery() {
  const [locale, setLocale] = useState<"uz" | "ru">("uz");
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "uz" ? uz : ru}
    >
      <MotionProvider>
        <Contents onLocale={setLocale} />
      </MotionProvider>
    </NextIntlClientProvider>
  );
}
