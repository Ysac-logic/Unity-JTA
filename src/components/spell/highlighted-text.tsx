"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function HighlightedText({ children, className, barClassName = "bg-lu-red", delay = 0.2, from = "left" }: { children: ReactNode; className?: string; barClassName?: string; delay?: number; from?: "left" | "right" }) {
  return (
    <span className={`relative inline-block px-[0.12em] ${className ?? ""}`}>
      <motion.span
        aria-hidden
        className={`absolute inset-x-0 inset-y-[0.06em] -z-0 ${barClassName}`}
        style={{ originX: from === "left" ? 0 : 1 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}
