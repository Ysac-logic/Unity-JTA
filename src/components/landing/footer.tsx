import { Instagram, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { site, whatsappHref } from "@/content/landing";
import { Logo } from "./header";
import { WhatsAppIcon } from "./icons";

function Social({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  const cls = "grid size-11 place-items-center border border-lu-gray/30 transition-colors";
  if (!href) return <span className={`${cls} text-lu-gray/50`} title={`${label} em breve`} aria-label={`${label} em breve`}>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${cls} hover:border-lu-red hover:bg-lu-red`}>
      {children}
    </a>
  );
}

export function Footer() {
  const { instagram, email } = site.contact;
  return (
    <footer className="bg-lu-black py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <Logo className="text-3xl sm:text-4xl" />
          <p className="mt-3 font-display text-sm uppercase tracking-[0.24em] text-lu-gray">Consultoria de treino online</p>
        </div>
        <div className="flex gap-3">
          <Social href={instagram ? `https://instagram.com/${instagram.replace(/^@/, "")}` : undefined} label="Instagram"><Instagram className="size-5" aria-hidden /></Social>
          <Social href={whatsappHref()} label="WhatsApp"><WhatsAppIcon className="size-5" /></Social>
          <Social href={email ? `mailto:${email}` : undefined} label="E-mail"><Mail className="size-5" aria-hidden /></Social>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="border-t border-lu-gray/20 pt-6 font-display text-xs uppercase tracking-[0.2em] text-lu-gray">{site.footer.copyright}</p>
      </div>
    </footer>
  );
}
