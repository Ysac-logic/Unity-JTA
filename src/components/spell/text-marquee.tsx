"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function TextMarquee({ items, prefix, height = 220, speed = 1, className, itemClassName }: { items: string[]; prefix?: ReactNode; height?: number; speed?: number; className?: string; itemClassName?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={`flex items-center gap-[0.35em] ${className ?? ""}`}>
      {prefix}
      <span className="sr-only">{items.join(", ")}</span>
      <div aria-hidden className="lu-marquee-mask relative overflow-hidden" style={{ height }}>
        <motion.div
          className="flex flex-col"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: (items.length * 1.8) / speed, ease: "linear", repeat: Infinity }}
        >
          {loop.map((item, i) => (
            <span key={i} className={itemClassName}>{item}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
