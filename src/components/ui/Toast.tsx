"use client";
import { useEffect, useEffectEvent } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";
import { IconButton } from "./IconButton";
export function Toast({
  message,
  onClose,
  duration = 3000,
}: {
  message: string;
  onClose: () => void;
  duration?: number;
}) {
  const t = useTranslations("ui");
  const reduced = useReducedMotion();
  const dismiss = useEffectEvent(onClose);
  useEffect(() => {
    const id = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(id);
  }, [duration]);
  return (
    <motion.div
      className="toast"
      role="status"
      style={{ x: "-50%" }}
      initial={{ y: reduced ? 0 : "var(--toast-offset)", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{
        y: reduced ? 0 : "var(--toast-offset)",
        opacity: 0,
        transition: {
          duration: reduced
            ? motionTokens.duration.instant
            : motionTokens.duration.fast,
          ease: motionTokens.ease.exit,
        },
      }}
      transition={{
        duration: reduced
          ? motionTokens.duration.instant
          : motionTokens.duration.base,
        ease: motionTokens.ease.enter,
      }}
    >
      <span>{message}</span>
      <IconButton variant="ink" aria-label={t("close")} onClick={onClose}>
        <X size={20} />
      </IconButton>
    </motion.div>
  );
}
