import { site } from "@/content/landing";
import { LandingIcon } from "./icons";
import { Eyebrow, Reveal, SectionTitle } from "./ui";

export function Differentials() {
  const d = site.differentials;
  return (
    <section id="diferenciais" className="relative bg-lu-black pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-lu-red via-lu-red/40 to-transparent" />
        <div className="grid gap-12 pt-24 sm:pt-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{d.eyebrow}</Eyebrow>
              <SectionTitle className="mt-6">{d.title}</SectionTitle>
            </div>
          </div>
          <ul className="lg:col-span-7">
            {d.items.map((item, i) => (
              <Reveal key={item.title} as="li" delay={i * 0.08} className="group grid grid-cols-[auto_1fr] gap-5 border-t border-lu-red/80 py-8 last:border-b sm:gap-8 sm:py-10">
                  <span className="grid size-14 place-items-center bg-lu-coal text-lu-red-hi transition-colors duration-300 group-hover:bg-lu-red group-hover:text-lu-ice">
                    <LandingIcon name={item.icon} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-anton text-3xl uppercase leading-none transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">{item.title}</h3>
                    <p className="mt-3 max-w-md text-lg text-lu-gray">{item.text}</p>
                  </div>
                </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
