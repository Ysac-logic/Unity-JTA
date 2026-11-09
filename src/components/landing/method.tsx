import { site } from "@/content/landing";
import { LandingIcon } from "./icons";
import { Eyebrow, Reveal, SectionTitle } from "./ui";

export function Method() {
  const m = site.method;
  return (
    <section id="metodo" className="relative bg-lu-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Eyebrow>{m.eyebrow}</Eyebrow>
        <SectionTitle className="mt-6 max-w-4xl">{m.title}</SectionTitle>

        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {m.steps.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 0.1} className="group relative flex h-full flex-col overflow-hidden border border-lu-gray/30 bg-lu-coal/60 p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1.5 hover:border-lu-red sm:p-7">
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lu-red transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="lu-outline font-anton text-7xl leading-none text-lu-gray/70 transition-colors duration-500 group-hover:text-lu-red-hi">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <LandingIcon name={s.icon} className="size-8 text-lu-red-hi transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                </div>
                <h3 className="mt-12 font-anton text-3xl uppercase leading-none">{s.title}</h3>
                <p className="mt-4 text-lu-gray">{s.text}</p>
              </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
