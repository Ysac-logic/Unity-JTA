import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { CheckCircle2, Clock, AlertTriangle, CircleDashed, XCircle, type LucideIcon } from "lucide-react";
import { PAY_STATUS, type PayStatus } from "@/lib/pay-status";
import { initials } from "@/lib/labels";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border border-transparent font-bold tracking-[0.03em] transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-out-quart)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-press",
  secondary: "border-white/70 bg-transparent text-fg hover:bg-fg hover:text-bg active:bg-fg active:text-bg",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  danger: "border-brand/50 bg-transparent text-brand-text hover:bg-brand-soft",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base uppercase tracking-[0.04em]",
};

export const btn = (v: Variant = "primary", s: Size = "md", extra?: string) => cx(base, variants[v], sizes[s], extra);

export function Button({ variant = "primary", size = "md", className, ...p }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={btn(variant, size, className)} {...p} />;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...p }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={btn(variant, size, className)} {...p} />;
}

export function Card({ className, ...p }: ComponentProps<"div">) {
  return <div className={cx("rounded-[var(--radius-card)] border border-line bg-surface", className)} {...p} />;
}

export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 id={id} className="font-display text-2xl uppercase leading-none text-fg">
        {children}
      </h2>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="font-display text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] uppercase leading-[0.9] text-balance">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone }: { label: string; value: ReactNode; hint?: ReactNode; icon?: LucideIcon; tone?: "brand" | "ok" | "warn" }) {
  const toneCls = tone === "brand" ? "text-brand-text" : tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : "text-fg";
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        {Icon && <Icon aria-hidden className="size-4 text-subtle" />}
      </div>
      <div className={cx("mt-2 font-display text-4xl leading-none tnum", toneCls)}>{value}</div>
      {hint && <div className="mt-1.5 text-[13px] text-subtle">{hint}</div>}
    </Card>
  );
}

const statusStyle: Record<PayStatus, { cls: string; Icon: LucideIcon }> = {
  PAGO: { cls: "bg-ok-soft text-ok", Icon: CheckCircle2 },
  A_VENCER: { cls: "bg-warn-soft text-warn", Icon: Clock },
  PENDENTE: { cls: "bg-info-soft text-fg", Icon: CircleDashed },
  ATRASO: { cls: "bg-brand-soft text-brand-text", Icon: AlertTriangle },
  CANCELADO: { cls: "bg-surface-3 text-subtle", Icon: XCircle },
};

export function StatusBadge({ status, size = "sm" }: { status: PayStatus; size?: "sm" | "lg" }) {
  const { cls, Icon } = statusStyle[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border border-current/30 font-bold whitespace-nowrap", cls, size === "lg" ? "px-3.5 py-1.5 text-sm uppercase tracking-wide" : "px-2.5 py-1 text-xs")}>
      <Icon aria-hidden className={size === "lg" ? "size-4" : "size-3.5"} />
      {PAY_STATUS[status]}
    </span>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "brand" | "ok" | "warn" }) {
  const t = { default: "bg-surface-3 text-muted", brand: "bg-brand-soft text-brand-text", ok: "bg-ok-soft text-ok", warn: "bg-warn-soft text-warn" }[tone];
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", t)}>{children}</span>;
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="inline-grid shrink-0 place-items-center rounded-full border border-line-strong bg-surface-3 font-display text-fg"
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center px-6 py-10 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full border border-line-strong bg-brand">
        <Icon aria-hidden className="size-5 text-white" />
      </span>
      <p className="font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

const field =
  "w-full rounded-2xl border border-line-strong bg-surface-2 px-4 text-base text-fg placeholder:text-subtle transition-colors hover:border-white focus:border-brand-text focus:outline-none";

export function Field({ label, hint, required, children, className }: { label: string; hint?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-fg">
        {label}
        {required && <span className="text-brand-text"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-subtle">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...p }: ComponentProps<"input">) {
  return <input className={cx(field, "h-12", className)} {...p} />;
}

export function Select({ className, ...p }: ComponentProps<"select">) {
  return <select className={cx(field, "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22><path d=%22M2 4l4 4 4-4%22/></svg>')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10", className)} {...p} />;
}

export function Textarea({ className, ...p }: ComponentProps<"textarea">) {
  return <textarea className={cx(field, "min-h-24 py-3", className)} {...p} />;
}

export function Tabs({ items, active }: { items: { key: string; label: string; href: string }[]; active: string }) {
  return (
    <nav aria-label="Seções" className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-2">
        {items.map((t) => (
          <li key={t.key}>
            <Link
              href={t.href}
              aria-current={t.key === active ? "page" : undefined}
              className={cx(
                "inline-flex h-11 items-center rounded-full border border-line-strong px-4 text-sm font-bold tracking-[0.03em] transition-colors",
                t.key === active ? "border-brand bg-brand text-white" : "bg-transparent text-fg hover:bg-surface-2",
              )}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Brand({ compact }: { compact?: boolean }) {
  return (
    <span className="brand-mark inline-flex items-center gap-2 uppercase leading-none">
      <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand text-[15px] text-white">L</span>
      <span className={compact ? "text-xl" : "text-2xl"}>
        Low Unity <span className="text-brand-text">JTA</span>
      </span>
    </span>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-2.5 w-full overflow-hidden rounded-full border border-line-strong bg-surface-3">
      <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
