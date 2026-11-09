"use client";

import { motion } from "framer-motion";

export function WordsStagger({ children, className, delay = 0, stagger = 0.035 }: { children: string; className?: string; delay?: number; stagger?: number }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
