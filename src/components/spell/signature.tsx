"use client";

import { motion } from "framer-motion";

export function Signature({ text, className, color = "#F5F4EF", fontSize = 120, duration = 2.2, delay = 0 }: { text: string; className?: string; color?: string; fontSize?: number; duration?: number; delay?: number }) {
  const width = text.length * fontSize * 0.5 + fontSize;
  const height = fontSize * 1.6;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={text}>
      <motion.text
        x="50%"
        y="62%"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-sign)", fontSize }}
        stroke={color}
        strokeWidth={1.4}
        strokeDasharray={900}
        fill={color}
        initial={{ strokeDashoffset: 900, fillOpacity: 0 }}
        animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
        transition={{
          strokeDashoffset: { duration, ease: [0.65, 0, 0.35, 1], delay },
          fillOpacity: { duration: 0.8, ease: "easeOut", delay: delay + duration * 0.7 },
        }}
      >
        {text}
      </motion.text>
    </svg>
  );
}
