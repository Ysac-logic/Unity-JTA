import { MessageCircle, ArrowUpRight } from "lucide-react";
import { TEAM, wa } from "@/lib/team";

export function TeamContacts({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <ul className={compact ? "grid gap-2 sm:grid-cols-3" : "space-y-3"}>
      {TEAM.map((p) => (
        <li key={p.name}>
          <a
            href={wa(p.whatsapp, text.replace("{nome}", p.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-brand/60"
          >
            <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-3 font-display text-xl font-extrabold">{p.name[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-xl font-bold uppercase leading-tight">{p.name}</span>
              {!compact && <span className="block text-sm text-muted">{p.specialty}</span>}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25d366]/15 px-3 py-1.5 text-xs font-bold text-[#4ade80]">
              <MessageCircle aria-hidden className="size-4" /> WhatsApp
            </span>
            <ArrowUpRight aria-hidden className="size-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
