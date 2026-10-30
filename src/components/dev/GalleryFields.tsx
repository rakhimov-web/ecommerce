"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { SearchPill } from "@/components/ui/SearchPill";
import { TextField } from "@/components/ui/TextField";
import { PhoneField } from "@/components/ui/PhoneField";
import { OtpInput } from "@/components/ui/OtpInput";
export function GalleryFields() {
  const t = useTranslations("ui");
  const [chip, setChip] = useState(0);
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  return (
    <section className="gallery-section">
      <h2 className="type-heading-lg">{t("forms")}</h2>
      <ChipRow label={t("chips")}>
        {["default", "active", "long"].map((key, i) => (
          <Chip key={key} active={chip === i} onClick={() => setChip(i)}>
            {t(key)}
          </Chip>
        ))}
        <Chip disabled>{t("disabled")}</Chip>
      </ChipRow>
      <div className="gallery-controls mt-xl">
        <div className="gallery-state">
          <SearchPill value={search} onValueChange={setSearch} />
          <SearchPill defaultValue={t("sample")} />
          <SearchPill disabled defaultValue={t("disabled")} />
        </div>
        <div className="gallery-state">
          <TextField label={t("fieldLabel")} helper={t("helper")} />
          <TextField label={t("fieldLabel")} error={t("error")} />
          <TextField label={t("disabled")} disabled />
        </div>
        <div className="gallery-state">
          <PhoneField
            label={t("phone")}
            value={phone}
            onValueChange={setPhone}
          />
          <PhoneField label={t("phone")} error={t("error")} />
          <PhoneField label={t("disabled")} disabled />
          <OtpInput label={t("otp")} value={otp} onValueChange={setOtp} />
          <OtpInput label={t("otp")} error={t("error")} />
          <OtpInput label={t("disabled")} disabled />
        </div>
      </div>
    </section>
  );
}
