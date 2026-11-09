"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { whatsappHref } from "@/content/landing";
import { SlideUpText } from "@/components/spell/slide-up-text";

export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <Reveal y={10}>
      <p className={`flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.28em] ${tone === "dark" ? "text-lu-red-hi" : "text-lu-red"}`}>
        <span aria-hidden className="h-px w-8 bg-current" />
        {children}
      </p>
    </Reveal>
  );
}

export function SectionTitle({ children, className = "" }: { children: string; className?: string }) {
  return (
    <h2 className={`font-anton text-[clamp(2.6rem,7.5vw,6rem)] uppercase leading-[0.92] ${className}`}>
      <SlideUpText>{children}</SlideUpText>
    </h2>
  );
}

type CtaProps = { children: ReactNode; variant?: "red" | "ghost" | "black" | "ice"; href?: string; message?: string; className?: string };

const variants = {
  red: "bg-lu-red text-lu-ice hover:bg-[#9e1124]",
  ghost: "border border-lu-gray/60 text-lu-ice hover:border-lu-ice hover:bg-lu-ice/5",
  black: "bg-lu-black text-lu-ice hover:bg-lu-coal",
  ice: "bg-lu-ice text-lu-black hover:bg-white",
};

export function Cta({ children, variant = "red", href, message, className = "" }: CtaProps) {
  const external = !href;
  return (
    <motion.a
      href={href ?? whatsappHref(message)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`group inline-flex min-h-13 items-center justify-center gap-3 px-7 font-display text-base font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}
