import { site } from "@/content/landing";
import { BlurReveal } from "@/components/spell/blur-reveal";
import { WordsStagger } from "@/components/spell/words-stagger";
import { Cta, Reveal } from "./ui";

export function FinalCta() {
  const c = site.finalCta;
  return (
    <section className="lu-grain relative isolate overflow-hidden bg-lu-red py-24 text-center sm:py-36">
      <span aria-hidden className="lu-outline absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-anton text-[30vw] leading-none text-lu-ice/15">
        UNITY
      </span>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="font-anton text-[clamp(2.8rem,8.5vw,7rem)] uppercase leading-[1.1]">
          <BlurReveal>{c.title}</BlurReveal>
        </h2>
        <p className="mt-7 text-xl text-lu-ice/85">
          <WordsStagger delay={0.3}>{c.description}</WordsStagger>
        </p>
        <Reveal delay={0.4} className="mt-10">
          <Cta variant="black" className="w-full sm:w-auto sm:px-12">{c.button}</Cta>
        </Reveal>
      </div>
    </section>
  );
}
