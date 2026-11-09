import { site } from "@/content/landing";
import { SlideUpText } from "@/components/spell/slide-up-text";
import { RandomizedText } from "@/components/spell/randomized-text";
import { WordsStagger } from "@/components/spell/words-stagger";
import { Photo } from "./photo";
import { Cta, Reveal } from "./ui";

export function Hero() {
  const h = site.hero;
  return (
    <section id="inicio" className="lu-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-lu-black pt-16 lg:pt-[4.5rem]">
      <div className="absolute inset-0 -z-10">
        {h.image ? (
          <Photo src={h.image} alt="" priority />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_70%,rgb(133_13_28/0.35),transparent_55%),linear-gradient(180deg,#121212,#0b0b0b)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(146_146_146/0.07)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%]" />
            <span className="lu-outline absolute -right-[4vw] bottom-[-6vw] select-none font-anton text-[38vw] leading-none text-lu-gray/25">JTA</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-lu-black via-lu-black/70 to-lu-black/30" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-10 pt-16 sm:px-6 lg:px-10 lg:pb-14">
        <p className="mb-6 flex items-center gap-3 font-sans text-sm font-bold uppercase tracking-[0.3em] text-lu-red-hi sm:text-base">
          <span aria-hidden className="h-px w-10 bg-lu-red-hi" />
          <RandomizedText split="chars" delay={0.2}>{h.eyebrow}</RandomizedText>
        </p>

        <h1 className="max-w-[14ch] font-anton text-[clamp(3.2rem,11vw,9.5rem)] uppercase leading-[1.1] tracking-[0.005em]">
          <SlideUpText
            delay={0.15}
            accent={h.accent}
          >
            {h.title}
          </SlideUpText>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-lu-ice/80 sm:text-xl">
          <WordsStagger delay={0.6}>{h.description}</WordsStagger>
        </p>

        <Reveal delay={0.9} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Cta>{h.primary}</Cta>
          <Cta variant="ghost" href={h.secondary.href}>{h.secondary.label}</Cta>
        </Reveal>

        <Reveal delay={1.1} className="mt-14 grid grid-cols-3 border-t border-lu-gray/25 pt-6">
          {h.facts.map((f) => (
            <div key={f.label} className="border-l border-lu-red/70 pl-3 first:border-l-0 first:pl-0 sm:pl-5">
              <p className="font-anton text-3xl leading-none sm:text-5xl">{f.value}</p>
              <p className="mt-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-lu-gray sm:text-xs">{f.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
