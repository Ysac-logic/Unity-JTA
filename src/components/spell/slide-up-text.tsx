"use client";

import { motion } from "framer-motion";

type Props = {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  accent?: string;
  accentClassName?: string;
};

export function SlideUpText({ children, className, delay = 0, stagger = 0.07, accent, accentClassName = "lu-wave-text" }: Props) {
  const words = children.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
            >
              {accent && word.toUpperCase() === accent.toUpperCase() ? <span className={accentClassName}>{word}</span> : word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
