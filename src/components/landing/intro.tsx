"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Signature } from "@/components/spell/signature";

const KEY = "lu-intro-seen";
const DURATION = 3400;

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen) { setShow(false); return; }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    const t = setTimeout(() => setShow(false), DURATION);
    const skip = (e: KeyboardEvent) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", skip);
    return () => { clearTimeout(t); window.removeEventListener("keydown", skip); };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = show ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [show]);

  return (
    <>
      <noscript><style>{".lu-intro{display:none!important}"}</style></noscript>
      <AnimatePresence>
        {show && (
          <motion.div
            key="intro"
            className="lu-intro lu-grain fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-lu-black"
            onClick={() => setShow(false)}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            initial={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Abertura LOW UNITY JTA"
            role="presentation"
          >
            <motion.p
              className="font-sans text-sm uppercase tracking-[0.6em] text-lu-gray"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Low
            </motion.p>
            <Signature text="Unity JTA" className="w-[min(88vw,760px)]" fontSize={120} duration={2} delay={0.3} />
            <motion.span
              aria-hidden
              className="mt-2 h-px w-[min(60vw,420px)] origin-left bg-lu-red-hi"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 1.6 }}
            />
            <motion.p
              className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.4em] text-lu-gray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.6 }}
            >
              Consultoria de treino online
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
