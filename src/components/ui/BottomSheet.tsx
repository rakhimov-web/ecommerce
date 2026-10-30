"use client";
import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  useEffectEvent,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { motionTokens } from "@/lib/motion";
import { IconButton } from "./IconButton";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const focusable =
  'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]';
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const t = useTranslations("ui");
  const id = useId();
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const requestClose = useEffectEvent(onClose);
  useEffect(() => {
    if (!open || !mounted) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node !== overlay.current,
    );
    const prior = siblings.map((node) => node.inert);
    siblings.forEach((node) => {
      node.inert = true;
    });
    const items = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(focusable) ?? [],
      ).filter(
        (node) => !node.closest('[inert],[hidden],[aria-hidden="true"]'),
      );
    (items()[0] ?? panel.current)?.focus();
    function keyboard(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
      if (e.key === "Tab") {
        const list = items();
        const first = list[0];
        const last = list.at(-1);
        if (!first) {
          e.preventDefault();
          panel.current?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    function focus(e: FocusEvent) {
      if (e.target instanceof Node && !panel.current?.contains(e.target))
        (items()[0] ?? panel.current)?.focus();
    }
    document.addEventListener("keydown", keyboard);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("focusin", focus);
      siblings.forEach((node, i) => {
        node.inert = prior[i];
      });
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, [open, mounted]);
  if (!mounted) return null;
  return createPortal(
    <div ref={overlay}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.fast }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={id}
              tabIndex={-1}
              ref={panel}
              className="bottom-sheet"
              initial={{ y: reduced ? 0 : "100%" }}
              animate={{ y: 0 }}
              exit={{ y: reduced ? 0 : "100%" }}
              transition={{
                duration: reduced ? 0 : motionTokens.duration.base,
                ease: motionTokens.ease.enter,
              }}
            >
              <div className="sheet-handle" aria-hidden="true" />
              <div className="sheet-heading">
                <h2 id={id} className="type-heading-lg">
                  {title}
                </h2>
                <IconButton aria-label={t("close")} onClick={onClose}>
                  <X size={24} />
                </IconButton>
              </div>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
