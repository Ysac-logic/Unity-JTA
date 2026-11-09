import { Quote } from "lucide-react";
import { site } from "@/content/landing";
import { BeforeAfter } from "./before-after";
import { Eyebrow, Reveal, SectionTitle } from "./ui";

export function Results() {
  const r = site.results;
  return (
    <section id="resultados" className="bg-lu-ice py-24 text-lu-black sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Eyebrow tone="light">{r.eyebrow}</Eyebrow>
        <SectionTitle className="mt-6">{r.title}</SectionTitle>

        <div className="mt-14 grid gap-10">
          {r.comparisons.map((c, i) => (
            <Reveal key={i}><BeforeAfter {...c} /></Reveal>
          ))}
        </div>

        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {r.testimonials.map((t, i) => (
            <Reveal key={i} as="li" delay={i * 0.1} className="group relative flex flex-col bg-lu-black p-7 text-lu-ice transition-transform duration-500 hover:-translate-y-1.5 sm:p-8">
              <Quote aria-hidden className="size-9 fill-lu-red text-lu-red transition-transform duration-500 group-hover:-rotate-6" />
              <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-lu-ice/85">“{t.text}”</blockquote>
              <div className="mt-8 border-t border-lu-gray/25 pt-5">
                <p className="font-anton text-xl uppercase">{t.name}</p>
                <p className="mt-1 font-display text-sm uppercase tracking-[0.14em] text-lu-gray">{t.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
