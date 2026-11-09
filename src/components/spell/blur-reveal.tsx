"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function BlurReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.span>
  );
}
