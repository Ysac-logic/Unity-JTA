import { Wallet, BellRing } from "lucide-react";
import { db } from "@/lib/db";
import { invoiceStatus, syncInvoices, DUE_SOON_DAYS } from "@/lib/finance";
import { diffDays, fDate, fMonthYear, today, ymd } from "@/lib/dates";
import { brl, METHODS } from "@/lib/labels";
import { saveSubscription, cancelSubscription, cancelInvoice } from "@/app/actions/finance";
import { Button, Card, EmptyState, Field, Input, SectionTitle, Select, StatusBadge, Textarea, btn, cx } from "./ui";
import { ConfirmSubmit } from "./confirm-submit";
import { PaymentForm } from "./payment-form";

export async function FinanceView({ studentId, staff = false, pay }: { studentId: string; staff?: boolean; pay?: React.ReactNode }) {
  await syncInvoices();
  const [sub, invoices, plans] = await Promise.all([
    db.subscription.findFirst({ where: { studentId }, orderBy: [{ status: "asc" }, { createdAt: "desc" }], include: { plan: true } }),
    db.invoice.findMany({ where: { studentId }, orderBy: { dueDate: "desc" }, include: { payments: { include: { recordedBy: { select: { name: true } } } } } }),
    staff ? db.plan.findMany({ where: { active: true } }) : Promise.resolve([]),
  ]);
  const active = sub?.status === "ACTIVE" ? sub : null;
  const open = invoices.filter((i) => i.status === "OPEN").sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const current = open[0] ?? invoices[0];
  const status = current ? invoiceStatus(current) : null;
  const days = current ? diffDays(current.dueDate, today()) : 0;
  const late = open.filter((i) => invoiceStatus(i) === "ATRASO");
  const paid = invoices.filter((i) => i.status === "PAID");

  if (!sub && !staff) return <EmptyState icon={Wallet} title="Nenhum plano ativo" description="Fale com a equipe LOW UNITY JTA para ativar sua mensalidade." />;

  return (
    <div className="space-y-8">
      {current && status ? (
        <Card className={cx("relative overflow-hidden p-5 sm:p-6", status === "ATRASO" && "border-brand/60")}>
          <p className="eyebrow">{staff ? "Mensalidade atual" : "Minha mensalidade"}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-5xl font-extrabold leading-none tnum">{brl(current.amountCents)}</p>
              <p className="mt-2 text-muted tnum">
                {status === "PAGO" ? `Pago em ${fDate(current.paidAt)}` : `Vencimento ${fDate(current.dueDate)}`}
                {active?.plan && ` · ${active.plan.name}`}
              </p>
            </div>
            <StatusBadge status={status} size="lg" />
          </div>
          {status !== "PAGO" && status !== "CANCELADO" && (status === "ATRASO" || days <= DUE_SOON_DAYS) && (
            <p className={cx("mt-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm", status === "ATRASO" ? "bg-brand-soft text-brand-text" : "bg-warn-soft text-warn")}>
              <BellRing aria-hidden className="mt-0.5 size-4 shrink-0" />
              {status === "ATRASO"
                ? `Vencida há ${-days} dia${days === -1 ? "" : "s"}.${staff ? "" : " Regularize com a equipe para manter seu acompanhamento."}`
                : days === 0 ? "Vence hoje." : days === 1 ? "Vence amanhã." : `Vence em ${days} dias.`}
            </p>
          )}
          {active && (
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm sm:grid-cols-4">
              <div><dt className="text-subtle">Início</dt><dd className="font-semibold tnum">{fDate(active.startDate)}</dd></div>
              <div><dt className="text-subtle">Próximo vencimento</dt><dd className="font-semibold tnum">{fDate(active.nextDueDate)}</dd></div>
              <div><dt className="text-subtle">Forma</dt><dd className="font-semibold">{METHODS[active.paymentMethod] ?? active.paymentMethod}</dd></div>
              <div><dt className="text-subtle">Em atraso</dt><dd className={cx("font-semibold tnum", late.length > 0 && "text-brand-text")}>{late.length}</dd></div>
            </dl>
          )}
        </Card>
      ) : (
        staff && <EmptyState icon={Wallet} title="Sem mensalidade configurada" description="Defina o valor e o vencimento abaixo para iniciar o ciclo mensal." />
      )}

      {pay}

      {staff && open.length > 0 && (
        <Card className="p-4 sm:p-5">
          <SectionTitle>Registrar pagamento</SectionTitle>
          <PaymentForm
            invoices={open.map((i) => ({ id: i.id, label: `${fMonthYear(i.dueDate)} · ${brl(i.amountCents)} · vence ${fDate(i.dueDate)}`, amount: i.amountCents / 100 }))}
            defaultMethod={active?.paymentMethod ?? "PIX"}
            today={ymd(new Date())}
          />
        </Card>
      )}

      {staff && (
        <details className="group rounded-[var(--radius-card)] border border-line bg-surface" open={!active}>
          <summary className="flex h-14 cursor-pointer list-none items-center px-4 font-semibold [&::-webkit-details-marker]:hidden">
            {active ? "Editar plano e vencimento" : "Configurar mensalidade"}
          </summary>
          <form action={saveSubscription.bind(null, studentId)} className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
            <Field label="Plano">
              <Select name="planId" defaultValue={active?.planId ?? plans[0]?.id ?? ""}>
                <option value="">Personalizado</option>
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name} · {brl(p.priceCents)}</option>)}
              </Select>
            </Field>
            <Field label="Valor mensal (R$)" required>
              <Input name="amount" inputMode="decimal" defaultValue={active ? String(active.amountCents / 100) : plans[0] ? String(plans[0].priceCents / 100) : ""} required />
            </Field>
            {!active && (
              <Field label="Data de início">
                <Input type="date" name="startDate" defaultValue={ymd(new Date())} />
              </Field>
            )}
            <Field label={active ? "Próximo vencimento" : "Primeiro vencimento"} hint="Após cada pagamento, o vencimento avança um mês.">
              <Input type="date" name="nextDueDate" defaultValue={active ? ymd(active.nextDueDate) : ""} required />
            </Field>
            <Field label="Forma de pagamento">
              <Select name="method" defaultValue={active?.paymentMethod ?? "PIX"}>
                {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Observações financeiras" className="sm:col-span-2">
              <Textarea name="notes" defaultValue={active?.notes ?? ""} />
            </Field>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
          {active && (
            <form action={cancelSubscription.bind(null, studentId)} className="border-t border-line p-4">
              <ConfirmSubmit message="Cancelar o plano deste aluno?" className={btn("danger", "sm")}>Cancelar plano</ConfirmSubmit>
              <p className="mt-2 text-xs text-subtle">Mensalidades futuras em aberto serão canceladas. O histórico é mantido.</p>
            </form>
          )}
        </details>
      )}

      <section aria-labelledby="h-fin-hist">
        <SectionTitle id="h-fin-hist">Histórico de pagamentos</SectionTitle>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma mensalidade registrada.</p>
        ) : (
          <ul className="space-y-2">
            {invoices.map((i) => {
              const st = invoiceStatus(i);
              const p = i.payments[0];
              return (
                <li key={i.id}>
                  <Card className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg font-bold uppercase">{fMonthYear(i.dueDate)}</p>
                      <p className="text-sm text-muted tnum">
                        {brl(i.amountCents)} · {st === "PAGO" ? `pago em ${fDate(i.paidAt)}${i.method ? ` via ${METHODS[i.method]}` : ""}` : `vencimento ${fDate(i.dueDate)}`}
                      </p>
                      {staff && p?.recordedBy && <p className="text-xs text-subtle">Registrado por {p.recordedBy.name}</p>}
                    </div>
                    <StatusBadge status={st} />
                    {staff && i.status === "OPEN" && (
                      <form action={cancelInvoice.bind(null, i.id)}>
                        <ConfirmSubmit message={`Cancelar a mensalidade de ${fMonthYear(i.dueDate)}?`} className="h-8 text-xs font-semibold text-subtle hover:text-brand-text cursor-pointer">Cancelar</ConfirmSubmit>
                      </form>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
        {paid.length > 0 && <p className="mt-3 text-sm text-muted tnum">Total pago: {brl(paid.reduce((s, i) => s + i.amountCents, 0))}</p>}
      </section>
    </div>
  );
}
