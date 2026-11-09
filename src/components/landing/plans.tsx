import { Check } from "lucide-react";
import { site } from "@/content/landing";
import { Cta, Eyebrow, Reveal, SectionTitle } from "./ui";

export function Plans() {
  const p = site.plans;
  return (
    <section id="planos" className="lu-grain relative overflow-hidden bg-lu-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <SectionTitle className="mt-6 max-w-4xl">{p.title}</SectionTitle>

        <ul className="mt-16 grid items-stretch gap-4 lg:grid-cols-3">
          {p.items.map((plan, i) => (
            <Reveal
              key={plan.name}
              as="li"
              delay={i * 0.1}
              className={`group relative flex flex-col p-7 transition-transform duration-500 hover:-translate-y-1.5 sm:p-9 ${
                plan.featured ? "order-first border-2 border-lu-red bg-gradient-to-b from-lu-red/25 to-lu-coal lg:order-none lg:-my-4 lg:py-12" : "border border-lu-gray/30 bg-lu-coal/60"
              }`}
            >
              {plan.featured && "badge" in plan && (
                <span className="absolute -top-px right-6 bg-lu-red px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.22em]">{plan.badge}</span>
              )}
              <h3 className="font-anton text-4xl uppercase">{plan.name}</h3>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-xl font-semibold text-lu-gray">{p.currency}</span>
                <span className="font-anton text-7xl leading-none sm:text-8xl">{plan.price}</span>
                <span className="font-display text-lg font-semibold text-lu-gray">{p.period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-4 border-t border-lu-gray/20 pt-8">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-lg">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-lu-red">
                      <Check aria-hidden className="size-4" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Cta
                variant={plan.featured ? "red" : "ghost"}
                message={`${site.contact.whatsappMessage} Tenho interesse no plano ${plan.name}.`}
                className="mt-10 w-full"
              >
                {plan.cta}
              </Cta>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
