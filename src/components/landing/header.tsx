"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/content/landing";
import { Cta } from "./ui";

export function Logo({ className = "" }: { className?: string }) {
  const { pre, mid, post } = site.brand;
  return (
    <span className={`brand-mark uppercase ${className}`}>
      {pre} {mid} <span className="text-lu-red-hi">{post}</span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const bar = "absolute left-0 h-0.5 w-full bg-lu-ice";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 bg-lu-black transition-[border-color] duration-300 ${scrolled || open ? "border-b border-lu-red/60" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-10">
        <a href="#inicio" className="whitespace-nowrap text-lg sm:text-2xl" onClick={() => setOpen(false)} aria-label="LOW UNITY JTA, voltar ao início">
          <Logo />
        </a>
        <div className="flex items-center gap-5">
          <Cta className="max-md:!hidden !min-h-10 !px-5 !text-sm">{site.hero.primary}</Cta>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="lu-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative grid size-11 place-items-center"
          >
            <span className="relative block h-3.5 w-7">
              <motion.span className={`${bar} top-0`} animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "0%", rotate: 0, y: "0%" }} transition={{ duration: 0.35 }} />
              <motion.span className={`${bar} top-1/2 -translate-y-1/2 origin-right`} animate={{ scaleX: open ? 0 : 0.6 }} transition={{ duration: 0.25 }} />
              <motion.span className={`${bar} bottom-0`} animate={open ? { bottom: "50%", rotate: -45, y: "50%" } : { bottom: "0%", rotate: 0, y: "0%" }} transition={{ duration: 0.35 }} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="lu-menu"
            aria-label="Navegação principal"
            className="lu-grain fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-lu-black lg:top-[4.5rem]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-between gap-10 px-4 py-10 sm:px-6 lg:px-10">
              <ul className="flex flex-col">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-lu-gray/20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-5 py-4 font-anton text-[clamp(2.4rem,8vw,5rem)] uppercase leading-none transition-colors hover:text-lu-red-hi"
                    >
                      <span className="font-display text-sm font-semibold tracking-[0.2em] text-lu-gray">{String(i + 1).padStart(2, "0")}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-2">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Cta className="w-full sm:w-auto">{site.hero.primary}</Cta>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
