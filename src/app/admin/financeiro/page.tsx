import Link from "next/link";
import { Users, CheckCircle2, CircleDashed, AlertTriangle, Wallet, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { syncFinanceAlerts, invoiceStatus, PAY_STATUS, type PayStatus } from "@/lib/finance";
import { addDays, dateOnly, fDate, fDateTime, today } from "@/lib/dates";
import { brl, METHODS } from "@/lib/labels";
import { Card, Field, Input, PageHeader, SectionTitle, Select, Stat, StatusBadge, Tabs, btn } from "@/components/ui";

export const metadata = { title: "Financeiro" };

export default async function FinancePanel({ searchParams }: { searchParams: Promise<{ status?: string; mes?: string; aluno?: string; de?: string; ate?: string; view?: string }> }) {
  await requireStaff();
  await syncFinanceAlerts();
  const sp = await searchParams;
  const view = sp.view ?? "mensalidades";
  const ref = today();

  const month = sp.mes;
  const [students, invoices, payments] = await Promise.all([
    db.student.findMany({ where: { status: "ACTIVE" }, include: { user: { select: { name: true } } }, orderBy: { user: { name: "asc" } } }),
    db.invoice.findMany({
      where: {
        ...(month && { reference: month }),
        ...(sp.aluno && { studentId: sp.aluno }),
        ...((sp.de || sp.ate) && { dueDate: { ...(sp.de && { gte: dateOnly(sp.de) }), ...(sp.ate && { lte: dateOnly(sp.ate) }) } }),
      },
      orderBy: { dueDate: "asc" },
      include: { student: { include: { user: { select: { name: true } } } } },
    }),
    view === "historico"
      ? db.payment.findMany({ orderBy: { paidAt: "desc" }, take: 100, include: { invoice: { include: { student: { include: { user: { select: { name: true } } } } } }, recordedBy: { select: { name: true } } } })
      : Promise.resolve([]),
  ]);

  const withStatus = invoices.map((i) => ({ ...i, st: invoiceStatus(i, ref) }));
  const count = (s: PayStatus) => withStatus.filter((i) => i.st === s);
  const paid = count("PAGO");
  const pending = count("PENDENTE").concat(count("A_VENCER"));
  const late = count("ATRASO");
  const receivable = pending.concat(late).reduce((s, i) => s + i.amountCents, 0);
  const received = paid.reduce((s, i) => s + i.amountCents, 0);
  const next7 = withStatus.filter((i) => i.status === "OPEN" && i.dueDate >= ref && i.dueDate <= addDays(ref, 7));

  const rows = sp.status ? withStatus.filter((i) => i.st === sp.status) : withStatus.filter((i) => i.st !== "CANCELADO");
  const months = [...new Set((await db.invoice.findMany({ select: { reference: true }, distinct: ["reference"], orderBy: { reference: "desc" } })).map((r) => r.reference))];
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ ...sp, ...patch }).filter(([, v]) => v) as [string, string][]);
    return `?${p}`;
  };

  return (
    <>
      <PageHeader eyebrow="Mensalidades" title="Financeiro" description="Controle interno das mensalidades. Pagamentos são registrados manualmente pela equipe." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Alunos ativos" value={students.length} icon={Users} />
        <Stat label="Pagas" value={paid.length} icon={CheckCircle2} tone="ok" hint={brl(received)} />
        <Stat label="Pendentes" value={pending.length} icon={CircleDashed} />
        <Stat label="Em atraso" value={late.length} icon={AlertTriangle} tone={late.length ? "brand" : undefined} />
        <Stat label="A receber" value={brl(receivable)} icon={Wallet} />
        <Stat label="Vencem em 7 dias" value={next7.length} icon={Clock} tone={next7.length ? "warn" : undefined} />
      </div>

      <div className="mt-8">
        <Tabs active={view} items={[{ key: "mensalidades", label: "Mensalidades", href: qs({ view: "mensalidades" }) }, { key: "historico", label: "Histórico de pagamentos", href: qs({ view: "historico" }) }]} />
      </div>

      {view === "mensalidades" ? (
        <>
          <form className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6" aria-label="Filtros">
            <input type="hidden" name="view" value="mensalidades" />
            <Field label="Status">
              <Select name="status" defaultValue={sp.status ?? ""}>
                <option value="">Todos</option>
                {(Object.keys(PAY_STATUS) as PayStatus[]).map((k) => <option key={k} value={k}>{PAY_STATUS[k]}</option>)}
              </Select>
            </Field>
            <Field label="Mês">
              <Select name="mes" defaultValue={month ?? ""}>
                <option value="">Todos</option>
                {months.map((m) => <option key={m} value={m}>{m.slice(5)}/{m.slice(0, 4)}</option>)}
              </Select>
            </Field>
            <Field label="Aluno">
              <Select name="aluno" defaultValue={sp.aluno ?? ""}>
                <option value="">Todos</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.user.name}</option>)}
              </Select>
            </Field>
            <Field label="Vencimento de"><Input type="date" name="de" defaultValue={sp.de} /></Field>
            <Field label="até"><Input type="date" name="ate" defaultValue={sp.ate} /></Field>
            <div className="flex items-end gap-2">
              <button type="submit" className={btn("primary", "md", "flex-1")}>Filtrar</button>
              <Link href="/admin/financeiro" className={btn("ghost")}>Limpar</Link>
            </div>
          </form>

          <Card className="overflow-hidden">
            <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_8rem] gap-4 border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-subtle sm:grid">
              <span>Aluno</span><span>Valor</span><span>Vencimento</span><span>Status</span>
            </div>
            <ul className="divide-y divide-line">
              {rows.length === 0 && <li className="p-6 text-center text-sm text-muted">Nenhuma mensalidade para os filtros selecionados.</li>}
              {rows.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/alunos/${i.studentId}?tab=financeiro`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 px-4 py-3.5 hover:bg-surface-2 sm:grid-cols-[minmax(0,2fr)_1fr_1fr_8rem]">
                    <span className="truncate font-semibold">{i.student.user.name}</span>
                    <span className="text-right font-semibold tnum sm:text-left">{brl(i.amountCents)}</span>
                    <span className="text-sm text-muted tnum">{fDate(i.dueDate)}{i.paidAt && <span className="sm:hidden"> · pago {fDate(i.paidAt)}</span>}</span>
                    <span className="justify-self-end sm:justify-self-start"><StatusBadge status={i.st} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <section aria-labelledby="h-ph">
          <SectionTitle id="h-ph">Últimos pagamentos</SectionTitle>
          <Card className="divide-y divide-line">
            {payments.length === 0 && <p className="p-6 text-center text-sm text-muted">Nenhum pagamento registrado.</p>}
            {payments.map((p) => (
              <Link key={p.id} href={`/admin/alunos/${p.invoice.studentId}?tab=financeiro`} className="flex flex-wrap items-center gap-x-4 gap-y-0.5 p-4 hover:bg-surface-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.invoice.student.user.name}</p>
                  <p className="text-xs text-subtle">{p.recordedBy ? `Registrado por ${p.recordedBy.name}` : ""} · {fDateTime(p.createdAt)}</p>
                </div>
                <span className="text-sm text-muted">{METHODS[p.method]} · {fDate(p.paidAt)}</span>
                <span className="font-display text-lg font-bold text-ok tnum">{brl(p.amountCents)}</span>
              </Link>
            ))}
          </Card>
        </section>
      )}
    </>
  );
}
