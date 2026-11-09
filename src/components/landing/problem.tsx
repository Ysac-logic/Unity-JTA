import { X } from "lucide-react";
import { site } from "@/content/landing";
import { HighlightedText } from "@/components/spell/highlighted-text";
import { SlideUpText } from "@/components/spell/slide-up-text";
import { LandingIcon } from "./icons";
import { Eyebrow, Reveal } from "./ui";

export function Problem() {
  const p = site.problem;
  const [a, b, c] = p.title;
  return (
    <section className="relative bg-lu-ice py-24 text-lu-black sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-7">
          <Eyebrow tone="light">{p.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-anton text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[1.1]">
            <SlideUpText>{a}</SlideUpText>{" "}
            <HighlightedText className="text-lu-ice" delay={0.5}>{b}</HighlightedText>{" "}
            <SlideUpText delay={0.25}>{c}</SlideUpText>
          </h2>
          <div className="mt-10 grid max-w-2xl gap-5 text-lg leading-relaxed text-lu-ink">
            {p.paragraphs.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}><p>{t}</p></Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-3">
              {p.pains.map((pain) => (
                <li key={pain} className="flex items-center gap-2 border border-lu-black/15 px-4 py-2 font-sans text-sm font-semibold uppercase tracking-[0.14em]">
                  <X aria-hidden className="size-4 text-lu-red" strokeWidth={2.5} />
                  {pain}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:pt-16" delay={0.15}>
          <div className="relative bg-lu-black p-7 text-lu-ice sm:p-10">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-lu-red" />
            <p className="font-sans text-sm font-bold uppercase tracking-[0.28em] text-lu-red-hi">{p.solution.eyebrow}</p>
            <h3 className="mt-4 font-anton text-4xl uppercase leading-[1.1] sm:text-5xl">{p.solution.title}</h3>
            <ul className="mt-8 divide-y divide-lu-gray/20">
              {p.solution.items.map((item) => (
                <li key={item.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="grid size-11 shrink-0 place-items-center border border-lu-red/70 text-lu-red-hi">
                    <LandingIcon name={item.icon} className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold uppercase tracking-[0.06em]">{item.title}</p>
                    <p className="mt-1 text-lu-gray">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
