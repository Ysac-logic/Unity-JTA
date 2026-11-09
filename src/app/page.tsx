import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Dumbbell, LineChart, Camera, Users, Timer, ShieldCheck, MessageCircle, Check, Quote } from "lucide-react";
import { Brand, btn, cx } from "@/components/ui";
import { BoltSticker, CheckSticker, Coin, DumbbellSticker, Ribbon } from "@/components/stickers";
import { TEAM, wa } from "@/lib/team";

export const metadata: Metadata = {
  title: "LOW UNITY JTA · Consultoria fitness online",
  description: "Três treinadores, uma única equipe. Treino individualizado, acompanhamento integrado e evolução medida.",
};

const JOIN = wa(TEAM[0].whatsapp, "Olá! Quero entrar na consultoria LOW UNITY JTA.");

const NAV = [
  ["Método", "#metodo"],
  ["Equipe", "#equipe"],
  ["Como funciona", "#como-funciona"],
  ["Resultados", "#resultados"],
] as const;

const MARQUEE = ["Três treinadores", "Uma única equipe", "Treino individualizado", "Evolução medida", "100% online"];

const PILLARS = [
  ["Individualização", "Cada treino parte do seu objetivo, rotina, histórico e limitações. Nada de planilha genérica.", "border-white/60 bg-brand text-white"],
  ["Progressão", "Cargas e volume evoluem com método. Cada série registrada alimenta o próximo ajuste.", "border-black bg-paper text-black"],
  ["Constância", "Sequência, frequência e metas semanais transformam disciplina em hábito.", "border-white/30 bg-surface-3 text-white"],
  ["Equipe integrada", "Três treinadores olham para o mesmo aluno. Você nunca depende de uma única agenda.", "border-white/60 bg-brand text-white"],
] as const;

const BENEFITS = [
  { Icon: Dumbbell, t: "Treino no app", d: "Exercício por exercício, com vídeo, séries, carga e descanso." },
  { Icon: Timer, t: "Cronômetro de descanso", d: "Pensado para usar no meio da academia, com uma mão." },
  { Icon: LineChart, t: "Evolução de cargas", d: "Veja o supino sair de 20 para 35 kg em gráfico." },
  { Icon: Camera, t: "Fotos privadas", d: "Antes e depois lado a lado. Só você e a equipe veem." },
  { Icon: Users, t: "Três treinadores", d: "Acompanhamento compartilhado entre todo o time." },
  { Icon: MessageCircle, t: "Contato direto", d: "Dúvidas respondidas pelo WhatsApp da equipe." },
];

const STEPS = [
  ["Contato", "Chame a equipe no WhatsApp e conte seu objetivo."],
  ["Avaliação", "Entendemos rotina, histórico, medidas e restrições."],
  ["Acesso ao app", "Seu treino é publicado e fica disponível na hora."],
  ["Acompanhamento", "Você treina, registra e a equipe ajusta continuamente."],
];

// Depoimentos de exemplo: substitua por relatos reais autorizados pelos alunos.
const TESTIMONIALS = [
  ["Pela primeira vez treino com constância. Ver a carga subindo semana após semana muda tudo.", "Aluno · Hipertrofia", "border-white/60 bg-brand text-white"],
  ["O app é simples de usar na academia e a equipe sempre responde rápido.", "Aluna · Emagrecimento", "border-black bg-paper text-black"],
  ["Ter três treinadores acompanhando faz diferença: sempre tem alguém olhando meu treino.", "Aluno · Força", "border-white/30 bg-surface-3 text-white"],
] as const;

const GALLERY = [
  { src: "/fotos/treino.jpg", alt: "Treinadores orientando um aluno na execução do puxador no cabo", caption: "Treino acompanhado" },
  { src: "/fotos/retrato.jpg", alt: "Treinador sentado em um banco na academia", caption: "Equipe presente" },
  { src: "/fotos/sorriso.jpg", alt: "Treinador sorrindo no salão de musculação", caption: "Evolução com método" },
] as const;

const ORDERED = ["Joalison", "Tallison", "Adrian"].map((n) => TEAM.find((t) => t.name === n)!);

const TEAM_BG = ["bg-brand text-white", "bg-paper text-black", "bg-surface-3 text-white"];

const section = "px-4 py-16 sm:px-6 sm:py-24 lg:px-10";
const wrap = "mx-auto w-full max-w-7xl";
const card = "rounded-[var(--radius-card)] border";

export default function Landing() {
  return (
    <div className="theme-lu min-h-dvh overflow-x-clip">
      <div aria-hidden className="overflow-hidden bg-brand py-2 text-white">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.032em]">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-8">
              {m}
              <span className="size-1.5 rounded-full bg-white" />
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 rounded-full border border-line-strong bg-coal pl-4 pr-2 sm:pl-5">
          <Link href="/" aria-label="LOW UNITY JTA"><Brand compact /></Link>
          <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="rounded-full border border-transparent px-4 py-2 text-xs font-bold uppercase tracking-[0.032em] transition-colors hover:bg-brand">{l}</a>
            ))}
          </nav>
          <Link href="/login" className={btn("primary", "sm", "h-10 !px-4 text-xs uppercase")}>Área do aluno</Link>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="band-ink relative isolate overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-10">
          <Image
            src="/fotos/equipe.jpg"
            alt="Os três treinadores da equipe JTA analisando um treino em uma prancheta"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[50%_22%] opacity-30"
          />
          <Coin className="absolute right-[4%] top-[3%] -z-0 size-14 rotate-12 sm:size-24 lg:size-32" />
          <DumbbellSticker className="absolute bottom-[14%] right-[6%] -z-0 hidden w-24 -rotate-12 sm:block lg:w-40" />

          <div className={cx(wrap, "relative")}>
            <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/50 px-4 py-2 !text-fg">
              <span aria-hidden className="size-2 rounded-full bg-brand" /> Consultoria fitness online
            </p>
            <h1 className="display max-w-[11ch] !leading-[1.1]">
              Uma equipe.
              <br />
              <span className="inline-block -rotate-1 rounded-[0.12em] border border-white bg-brand px-[0.12em] pb-[0.04em]">Sua melhor</span>
              <br />
              versão.
            </h1>
            <p className="lead mt-8 max-w-xl text-white/85">
              Três treinadores trabalhando juntos no seu resultado. Treino individualizado, execução guiada no app e evolução medida de verdade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={JOIN} target="_blank" rel="noopener noreferrer" className={btn("primary", "lg")}>
                Quero entrar <ArrowRight aria-hidden className="size-5" />
              </a>
              <a href="#metodo" className={btn("secondary", "lg")}>Conhecer o método</a>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
              {[["3", "treinadores", "border-white/60 bg-brand text-white"], ["1", "equipe", "border-white/30 bg-surface-3 text-white"], ["100%", "online", "border-black bg-paper text-black"]].map(([v, l, bg]) => (
                <div key={l} className={cx(card, bg, "p-3 sm:p-5")}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-[clamp(2rem,1.2rem+3vw,3.5rem)] leading-none tnum">{v}</dd>
                  <dd className="mt-1 text-xs font-bold uppercase tracking-[0.032em] sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className={cx("band-paper", section)}>
          <div className={cx(wrap, "grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-14")}>
            <h2 className="title">
              Não é planilha.
              <br />
              <span className="text-brand">É acompanhamento.</span>
            </h2>
            <div className={cx(card, "border-black bg-carbon p-6 text-white sm:p-8")}>
              <p className="lead">
                A LOW UNITY JTA é uma consultoria formada por três treinadores que administram juntos todos os alunos. Seu treino, seu histórico, suas fotos e suas medidas ficam visíveis para toda a equipe, para que cada decisão seja tomada com o quadro completo.
              </p>
            </div>
          </div>
        </section>

        {/* MÉTODO */}
        <section id="metodo" className={cx("band-coal scroll-mt-20", section)}>
          <div className={wrap}>
            <SectionHead eyebrow="Metodologia" title="Quatro pilares, nenhum atalho" />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map(([t, d, bg], i) => (
                <li key={t} className={cx(card, bg, "flex flex-col p-6")}>
                  <span className="font-display text-6xl leading-none tnum">0{i + 1}</span>
                  <h3 className="mt-8 font-display text-3xl uppercase leading-none">{t}</h3>
                  <p className="mt-3 font-medium">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* NA PRÁTICA */}
        <section id="na-pratica" className={cx("band-paper scroll-mt-20", section)}>
          <div className={wrap}>
            <SectionHead eyebrow="Na prática" title="Treino de perto, sem improviso" />
            <ul className="grid gap-4 md:grid-cols-3">
              {GALLERY.map(({ src, alt, caption }, i) => (
                <li key={src} className={cx("group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-black", i === 1 && "md:mt-10")}>
                  <Image src={src} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-[50%_30%] transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-4 left-4 rounded-full border border-black bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.032em] text-black">{caption}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* EQUIPE */}
        <section id="equipe" className={cx("band-ink relative isolate scroll-mt-20 overflow-hidden", section)}>
          <Ribbon flip className="absolute inset-x-[-6%] bottom-[-4%] -z-10 hidden h-[34%] w-[112%] md:block" />
          <div className={wrap}>
            <SectionHead eyebrow="A equipe" title="Três treinadores. Um time." />
            <ul className="grid gap-4 md:grid-cols-3">
              {ORDERED.map((p, i) => (
                <li key={p.name} className={cx(card, "overflow-hidden border-white/30 bg-surface")}>
                  <div className={cx("relative grid aspect-[16/10] place-items-center overflow-hidden border-b border-white/30", TEAM_BG[i % 3])}>
                    <span aria-hidden className="font-display text-[clamp(6rem,4rem+8vw,9rem)] leading-none">{p.name[0]}</span>
                    <span className="absolute bottom-3 left-4 rounded-full border border-black bg-paper px-3 py-1 text-xs font-bold text-black tnum">0{i + 1}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-4xl uppercase leading-none">{p.name}</h3>
                    <a href={wa(p.whatsapp, `Olá ${p.name}! Quero saber mais sobre a consultoria LOW UNITY JTA.`)} target="_blank" rel="noopener noreferrer" className={btn("secondary", "sm", "mt-4 h-11 w-full text-xs uppercase")}>
                      <MessageCircle aria-hidden className="size-4" /> Falar com {p.name}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className={cx("band-paper", section)}>
          <div className={cx(wrap, "grid items-center gap-12 lg:grid-cols-2 lg:gap-16")}>
            <div>
              <SectionHead eyebrow="Benefícios" title="Tudo em um só lugar" />
              <ul className="grid gap-3 sm:grid-cols-2">
                {BENEFITS.map(({ Icon, t, d }) => (
                  <li key={t} className={cx(card, "border-black bg-carbon p-5 text-white")}>
                    <span className={"mb-4 grid size-11 place-items-center rounded-full bg-brand text-white"}>
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="font-bold">{t}</h3>
                    <p className="mt-1 text-sm font-medium text-white/70">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-[320px]">
              <BoltSticker className="absolute -right-4 -top-6 z-10 size-16 rotate-12 sm:-right-10 sm:size-20" />
              <CheckSticker className="absolute -bottom-5 -left-4 z-10 size-14 -rotate-12 sm:-left-10 sm:size-16" />
              <PhonePreview />
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className={cx("band-coal scroll-mt-20", section)}>
          <div className={wrap}>
            <SectionHead eyebrow="Como funciona" title="Do primeiro contato ao primeiro treino" />
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(([t, d], i) => (
                <li key={t} className={cx(card, "border-black bg-paper p-6 text-black")}>
                  <span className="inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-[0.032em] text-white tnum">Passo 0{i + 1}</span>
                  <h3 className="mt-6 font-display text-3xl uppercase leading-none">{t}</h3>
                  <p className="mt-3 font-medium text-black/70">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RESULTADOS */}
        <section id="resultados" className={cx("band-ink scroll-mt-20", section)}>
          <div className={wrap}>
            <SectionHead eyebrow="Resultados" title="Quem treina com a gente" />
            <ul className="grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map(([q, who, bg]) => (
                <li key={who} className={cx(card, bg, "flex flex-col p-6")}>
                  <Quote aria-hidden className="size-8" />
                  <blockquote className="mt-4 flex-1 text-lg font-semibold leading-snug">{q}</blockquote>
                  <p className="mt-6 inline-flex w-fit rounded-full border border-black bg-paper px-3 py-1 text-sm font-bold text-black">{who}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-sm font-medium text-white/70">
              <ShieldCheck aria-hidden className="size-4 shrink-0" /> Fotos de evolução só são publicadas com autorização expressa do aluno.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="band-red relative isolate overflow-hidden px-4 pb-24 pt-32 sm:px-6 sm:py-28 lg:px-10">
          <Ribbon className="absolute inset-x-[-6%] top-[12%] -z-10 hidden h-[56%] sm:block w-[112%] [&_path:nth-child(1)]:stroke-black [&_path:nth-child(2)]:stroke-black [&_path:nth-child(3)]:stroke-[#444]" />
          <Coin label="JTA" className="absolute left-[3%] top-[8%] size-14 -rotate-12 sm:size-24" />
          <CheckSticker className="absolute bottom-[8%] right-[4%] size-14 rotate-12 sm:size-24" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="display">
              Comece <span className="inline-block rotate-1 rounded-[0.12em] border border-white bg-carbon px-[0.12em] pb-[0.04em] text-white">hoje.</span>
            </h2>
            <p className="lead mx-auto mt-6 max-w-md text-white">Fale com um dos treinadores e receba seu primeiro treino no app.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={JOIN} target="_blank" rel="noopener noreferrer" className={btn("primary", "lg", "!border-white !bg-carbon hover:!bg-white hover:!text-black")}>
                Entrar na consultoria <ArrowUpRight aria-hidden className="size-5" />
              </a>
              <Link href="/login" className={btn("secondary", "lg", "!border-white !bg-white !text-black hover:!bg-carbon hover:!text-white")}>Já sou aluno</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-carbon px-4 py-10 text-paper sm:px-6 lg:px-10">
        <div className={cx(wrap, "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between")}>
          <span className="brand-mark inline-flex items-center gap-2 text-xl uppercase leading-none">
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand text-[15px] text-white">L</span>
            Low Unity JTA
          </span>
          <ul className="flex flex-wrap gap-2">
            {ORDERED.map((p) => (
              <li key={p.name}>
                <a href={wa(p.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full border border-paper/60 px-4 text-xs font-bold uppercase tracking-[0.032em] transition-colors hover:bg-paper hover:text-carbon">{p.name} · WhatsApp</a>
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium text-paper/70">© {new Date().getFullYear()} LOW UNITY JTA</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 sm:mb-12">
      <p className="eyebrow mb-4 inline-flex rounded-full border border-current/50 px-4 py-2 !text-current">{eyebrow}</p>
      <h2 className="title max-w-4xl">{title}</h2>
    </div>
  );
}

function PhonePreview() {
  return (
    <div aria-hidden className="w-full rounded-[2.5rem] border border-black bg-carbon p-2.5 text-white">
      <div className="rounded-[2rem] bg-coal p-4">
        <div className="mb-4 flex items-center justify-between">
          <Brand compact />
          <span className="size-2.5 rounded-full bg-brand" />
        </div>
        <p className="eyebrow text-[10px]">Quinta-feira</p>
        <p className="font-display text-3xl uppercase leading-none">Olá, João!</p>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/60 bg-brand p-4">
          <p className="eyebrow text-[10px] !text-fg">Treino de hoje</p>
          <p className="mt-1 font-display text-2xl uppercase leading-none">Treino C · Pernas</p>
          <p className="mt-1 text-xs font-medium text-muted">5 exercícios</p>
          <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-white text-xs font-bold uppercase tracking-[0.04em] text-black">
            Começar treino <ArrowRight className="size-4" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[["22", "treinos", "border-white/30 bg-surface-3 text-white"], ["4 sem", "sequência", "border-white/60 bg-brand text-white"]].map(([v, l, bg]) => (
            <div key={l} className={cx("rounded-2xl border p-3", bg)}>
              <p className="font-display text-3xl leading-none tnum">{v}</p>
              <p className="mt-1 text-[11px] font-bold uppercase">{l}</p>
            </div>
          ))}
        </div>
        <ul className="mt-3 space-y-1.5">
          {["Agachamento livre", "Leg press 45°", "Cadeira extensora"].map((e) => (
            <li key={e} className="flex items-center gap-2 rounded-full bg-paper px-3 py-2 text-xs font-bold text-black">
              <Check className="size-3.5" /> {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
