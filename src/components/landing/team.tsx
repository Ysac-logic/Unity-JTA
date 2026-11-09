import { site } from "@/content/landing";
import { BlurReveal } from "@/components/spell/blur-reveal";
import { Photo } from "./photo";
import { Eyebrow, Reveal } from "./ui";

export function Team() {
  const t = site.team;
  return (
    <section id="equipe" className="bg-lu-ice py-24 text-lu-black sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Eyebrow tone="light">{t.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-4xl font-anton text-[clamp(2.6rem,7.5vw,6rem)] uppercase leading-[1.1]">
          <BlurReveal>{t.title}</BlurReveal>
        </h2>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.members.map((m, i) => (
            <Reveal key={i} as="li" delay={i * 0.12} className={`group ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-lu-black">
                  <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
                    <Photo src={m.photo} alt={`Foto de ${m.name}`} label="Foto do treinador" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-lu-black/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-anton text-lg text-lu-ice/80">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-lu-red transition-transform duration-500 group-hover:scale-x-100" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4 border-b border-lu-black/15 pb-5">
                  <div>
                    <h3 className="font-anton text-3xl uppercase leading-none">{m.name}</h3>
                    <p className="mt-2 font-sans text-base font-semibold uppercase tracking-[0.1em] text-lu-red">{m.specialty}</p>
                  </div>
                  <p className="shrink-0 pt-1 font-mono text-xs uppercase tracking-wider text-lu-ink">{m.cref}</p>
                </div>
              </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
