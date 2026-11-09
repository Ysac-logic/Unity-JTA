"use client";

import { motion } from "framer-motion";

const pseudoRandom = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

export function RandomizedText({ children, className, split = "words", delay = 0, duration = 0.9 }: { children: string; className?: string; split?: "chars" | "words"; delay?: number; duration?: number }) {
  const units = split === "chars" ? Array.from(children) : children.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {units.map((unit, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: delay + pseudoRandom(i + 1) * duration }}
          >
            {unit}
            {split === "words" && i < units.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
