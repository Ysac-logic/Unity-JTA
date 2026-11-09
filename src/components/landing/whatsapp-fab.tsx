"use client";

import { motion } from "framer-motion";
import { whatsappHref } from "@/content/landing";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFab() {
  return (
    <motion.a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a equipe no WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-15 place-items-center rounded-full bg-lu-red text-lu-ice shadow-[0_10px_30px_-8px_rgb(133_13_28/0.8)] sm:right-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <span aria-hidden className="lu-ping absolute inset-0 rounded-full bg-lu-red" />
      <WhatsAppIcon className="relative size-7" />
    </motion.a>
  );
}
