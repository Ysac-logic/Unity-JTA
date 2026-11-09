"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { site } from "@/content/landing";
import { Eyebrow, Reveal, SectionTitle } from "./ui";

export function Faq() {
  const f = site.faq;
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" className="bg-lu-ice py-24 text-lu-black sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <Eyebrow tone="light">{f.eyebrow}</Eyebrow>
          <SectionTitle className="mt-6">{f.title}</SectionTitle>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="border-t border-lu-black/80">
            {f.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="border-b border-lu-black/15">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className={`font-display text-xl font-bold uppercase tracking-[0.03em] transition-colors sm:text-2xl ${isOpen ? "text-lu-red" : "group-hover:text-lu-red"}`}>
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`grid size-10 shrink-0 place-items-center border transition-colors ${isOpen ? "border-lu-red bg-lu-red text-lu-ice" : "border-lu-black/25"}`}
                      >
                        <Plus aria-hidden className="size-5" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${id}-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 text-lg leading-relaxed text-lu-ink">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
