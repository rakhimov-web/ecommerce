"use client";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div className="accordion">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          className="accordion-trigger type-heading-md"
          onClick={() => setOpen(!open)}
        >
          {title}
          <ChevronDown
            size={24}
            className={open ? "chevron chevron-open" : "chevron"}
          />
        </button>
      </h3>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{
          duration: reduced ? 0 : motionTokens.duration.base,
          ease: motionTokens.ease.standard,
        }}
        id={id}
        inert={!open}
        aria-hidden={!open}
        className="accordion-body"
      >
        <div className="pb-xl">{children}</div>
      </motion.div>
    </div>
  );
}
