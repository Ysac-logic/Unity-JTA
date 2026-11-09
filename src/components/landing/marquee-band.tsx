import { site } from "@/content/landing";
import { TextMarquee } from "@/components/spell/text-marquee";

export function MarqueeBand() {
  const m = site.marquee;
  return (
    <section aria-label="Especialidades" className="lu-grain relative overflow-hidden border-y border-lu-red/60 bg-lu-black py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <TextMarquee
          items={m.words}
          height={210}
          speed={1}
          className="font-anton text-[clamp(2.2rem,7vw,5.5rem)] uppercase leading-[1.05]"
          itemClassName="block"
          prefix={<span className="shrink-0 text-lu-gray/60">{m.prefix} /</span>}
        />
      </div>
    </section>
  );
}
