"use client";

import { useState, useTransition } from "react";
import { CreditCard, QrCode, Barcode, Copy, Check, Loader2, MessageCircle, Lock } from "lucide-react";
import { reportPayment } from "@/app/actions/finance";
import { Button, Field, Input, cx } from "./ui";
import { TiltCard } from "./tilt-card";

type Method = "CARTAO" | "PIX" | "BOLETO";
type Props = { invoiceId: string; amount: string; due: string; studentName: string; pixKey: string; pixHolder: string; whatsappLink: string };

const TABS: { key: Method; label: string; Icon: typeof CreditCard }[] = [
  { key: "CARTAO", label: "Cartão de crédito", Icon: CreditCard },
  { key: "PIX", label: "Pix", Icon: QrCode },
  { key: "BOLETO", label: "Boleto", Icon: Barcode },
];

function BrandMark() {
  return (
    <span aria-hidden className="inline-flex items-center gap-1.5 font-display text-sm font-semibold leading-none tracking-tight">
      <span className="h-4 w-1 -skew-x-12 bg-brand" /> Low Unity <span className="text-brand-text">JTA</span>
    </span>
  );
}

function VisaLogo() {
  return (
    <svg width="50" height="16" viewBox="0 0 72 23" fill="none" aria-label="Visa" role="img">
      <path d="M35.6495 0.413261L30.841 22.6604H25.0219L29.8376 0.413261H35.6495ZM60.1288 14.7776L63.1897 6.42214L64.9541 14.7776H60.1288ZM66.6178 22.6604H72L67.3044 0.413261H62.3374C62.3302 0.413261 62.3206 0.413261 62.3134 0.413261C61.2115 0.413261 60.2657 1.08065 59.8672 2.02829L59.86 2.04492L51.1336 22.6604H57.2409L58.4556 19.3353H65.9192L66.6178 22.6604ZM51.4337 15.3975C51.4577 9.52396 43.2259 9.20095 43.2835 6.57652C43.3028 5.7785 44.0686 4.92823 45.749 4.7121C46.0611 4.68123 46.4212 4.66223 46.7861 4.66223C48.4929 4.66223 50.111 5.04698 51.5514 5.73575L51.4865 5.70725L52.5068 0.988022C50.8912 0.368134 49.0211 0.00712515 47.067 0H47.0646C41.3126 0 37.2675 3.02819 37.2315 7.35791C37.1955 10.5595 40.1195 12.3431 42.3257 13.4119C44.5943 14.5021 45.3553 15.2027 45.3433 16.1741C45.3289 17.6704 43.538 18.3259 41.8624 18.352C41.7855 18.3544 41.6919 18.3544 41.6007 18.3544C39.5097 18.3544 37.5412 17.8343 35.8224 16.9151L35.8872 16.946L34.8333 21.8196C36.7202 22.5677 38.9072 23 41.1974 23C41.2334 23 41.2694 23 41.3054 23H41.3006C47.4126 23 51.4097 20.0146 51.4313 15.3903L51.4337 15.3975ZM27.3361 0.413261L17.9112 22.6604H11.7607L7.1227 4.90211C7.03388 4.03759 6.49853 3.31557 5.75433 2.95456L5.73993 2.94744C4.08829 2.14467 2.16778 1.49153 0.158443 1.08065L0 1.05452L0.139237 0.410885H10.0395C11.3886 0.410885 12.5097 1.38703 12.7186 2.66243L12.721 2.67668L15.172 15.5518L21.2265 0.408509L27.3361 0.413261Z" fill="currentColor" />
    </svg>
  );
}

function MasterLogo() {
  return (
    <span aria-label="Mastercard" role="img" className="relative inline-flex h-6 w-10">
      <span className="absolute left-0 size-6 rounded-full bg-[#eb001b]" />
      <span className="absolute right-0 size-6 rounded-full bg-[#f79e1b] mix-blend-screen" />
    </span>
  );
}

const fmtNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export function PaymentOptions(p: Props) {
  const [tab, setTab] = useState<Method>("CARTAO");
  const [num, setNum] = useState("");
  const [name, setName] = useState(p.studentName.toUpperCase());
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<Method | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const send = (m: Method) => {
    setErr(null);
    start(async () => {
      const r = await reportPayment(p.invoiceId, m);
      if (r.error) setErr(r.error);
      else setDone(m);
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const digits = num.replace(/\D/g, "");
  const shown = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})(?=.)/g, "$1 ");

  return (
    <section aria-labelledby="h-pay" className="rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="h-pay" className="font-display text-lg font-bold uppercase">Pagar mensalidade</h2>
        <p className="font-display text-xl font-bold tnum">{p.amount}</p>
      </div>

      <div role="tablist" aria-label="Forma de pagamento" className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface-2 p-1">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="tab"
            type="button"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            onClick={() => { setTab(key); setDone(null); setErr(null); }}
            className={cx("flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-semibold transition-colors sm:flex-row sm:gap-2 sm:text-sm cursor-pointer", tab === key ? "bg-surface-3 text-fg" : "text-muted hover:text-fg")}
          >
            <Icon aria-hidden className={cx("size-4", tab === key && "text-brand-text")} />
            <span className="leading-tight">{key === "CARTAO" ? <><span className="sm:hidden">Cartão</span><span className="hidden sm:inline">{label}</span></> : label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === "CARTAO" && (
          <div className="space-y-6">
            <div className="flex min-h-[230px] items-center justify-center">
              <TiltCard
                tiltLimit={10}
                scale={1.05}
                perspective={1200}
                className="flex aspect-video w-[360px] max-w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-950 to-neutral-900 p-6 shadow-[0px_8px_16px_rgba(0,0,0,0.3),0px_16px_32px_rgba(0,0,0,0.2),0px_24px_48px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.06)] max-sm:scale-90"
              >
                <span aria-hidden className="pointer-events-none absolute -right-10 top-0 h-full w-16 -skew-x-12 bg-brand/70" />
                <div className="relative flex items-start justify-between">
                  <BrandMark />
                  <span className="text-fg">{digits.startsWith("4") ? <VisaLogo /> : digits.startsWith("5") ? <MasterLogo /> : null}</span>
                </div>
                <div className="relative flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted">{name || "NOME NO CARTÃO"}</p>
                    <p className="font-mono text-sm font-medium tracking-tight tabular-nums">{shown}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted">Exp.</p>
                    <p className="font-mono text-sm font-medium tabular-nums">{exp || "MM/AA"}</p>
                  </div>
                </div>
              </TiltCard>
            </div>

            {done === "CARTAO" ? (
              <Success text="Pedido enviado. A equipe vai te mandar o link de pagamento seguro pelo WhatsApp." link={p.whatsappLink} />
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); send("CARTAO"); }} className="grid grid-cols-2 gap-3" autoComplete="off">
                <Field label="Número do cartão" className="col-span-2">
                  <Input value={num} onChange={(e) => setNum(fmtNumber(e.target.value))} inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" />
                </Field>
                <Field label="Nome impresso" className="col-span-2">
                  <Input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} autoComplete="cc-name" />
                </Field>
                <Field label="Validade"><Input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" /></Field>
                <Field label="CVV"><Input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="cc-csc" placeholder="•••" type="password" /></Field>
                <p className="col-span-2 flex items-start gap-2 text-xs text-subtle">
                  <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  Os dados do cartão não saem do seu aparelho. O processamento online será ativado com a integração do gateway; por enquanto a equipe envia um link de pagamento seguro.
                </p>
                <Button type="submit" size="lg" className="col-span-2" disabled={pending}>
                  {pending && <Loader2 aria-hidden className="size-5 animate-spin" />} Pagar {p.amount}
                </Button>
              </form>
            )}
          </div>
        )}

        {tab === "PIX" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-surface-2 p-4">
              <p className="text-sm text-muted">Chave Pix · {p.pixHolder}</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate font-mono text-base text-fg">{p.pixKey}</code>
                <Button type="button" variant="secondary" size="sm" onClick={copy} aria-live="polite">
                  {copied ? <Check aria-hidden className="size-4 text-ok" /> : <Copy aria-hidden className="size-4" />} {copied ? "Copiada" : "Copiar"}
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted tnum">Valor: <span className="font-semibold text-fg">{p.amount}</span> · vencimento {p.due}</p>
            </div>
            {done === "PIX" ? (
              <Success text="A equipe foi avisada e vai confirmar o recebimento. Se puder, envie o comprovante." link={p.whatsappLink} />
            ) : (
              <>
                <Button type="button" size="lg" className="w-full" onClick={() => send("PIX")} disabled={pending}>
                  {pending && <Loader2 aria-hidden className="size-5 animate-spin" />} Já paguei, avisar a equipe
                </Button>
                <a href={p.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-text hover:underline">
                  <MessageCircle aria-hidden className="size-4" /> Enviar comprovante pelo WhatsApp
                </a>
              </>
            )}
          </div>
        )}

        {tab === "BOLETO" && (
          <div className="space-y-4">
            <p className="text-muted">O boleto é gerado pela equipe e enviado pelo WhatsApp. A compensação leva até 3 dias úteis.</p>
            {done === "BOLETO" ? (
              <Success text="Pedido de boleto enviado. Você vai receber pelo WhatsApp." link={p.whatsappLink} />
            ) : (
              <Button type="button" size="lg" className="w-full" onClick={() => send("BOLETO")} disabled={pending}>
                {pending && <Loader2 aria-hidden className="size-5 animate-spin" />} Solicitar boleto de {p.amount}
              </Button>
            )}
          </div>
        )}
        {err && <p role="alert" className="mt-3 text-sm text-brand-text">{err}</p>}
      </div>
    </section>
  );
}

function Success({ text, link }: { text: string; link: string }) {
  return (
    <div role="status" className="rounded-xl border border-ok/30 bg-ok-soft p-4">
      <p className="flex items-start gap-2 text-sm text-ok"><Check aria-hidden className="mt-0.5 size-4 shrink-0" /> {text}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-10 items-center gap-2 text-sm font-semibold text-fg hover:underline">
        <MessageCircle aria-hidden className="size-4" /> Abrir WhatsApp da equipe
      </a>
    </div>
  );
}
