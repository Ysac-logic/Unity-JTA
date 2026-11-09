import Link from "next/link";
import { Users, UserCheck, Dumbbell, Wallet, AlertTriangle, Clock, ChevronRight, Plus, Camera } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { syncFinanceAlerts, invoiceStatus } from "@/lib/finance";
import { addDays, fDate, fRelative, fDateTime, today } from "@/lib/dates";
import { ANGLES, brl } from "@/lib/labels";
import { Avatar, ButtonLink, Card, PageHeader, SectionTitle, Stat, StatusBadge } from "@/components/ui";

const INACTIVE_DAYS = 4;

export default async function AdminHome() {
  const user = await requireStaff();
  await syncFinanceAlerts();
  const ref = today();

  const [students, sessions30, openInvoices, activity, photos] = await Promise.all([
    db.student.findMany({ include: { user: { select: { name: true } }, sessions: { orderBy: { finishedAt: "desc" }, take: 1, select: { finishedAt: true, workoutName: true } } } }),
    db.workoutSession.count({ where: { finishedAt: { gte: addDays(ref, -30) } } }),
    db.invoice.findMany({ where: { status: "OPEN", subscription: { status: "ACTIVE" } }, orderBy: { dueDate: "asc" }, include: { student: { include: { user: { select: { name: true } } } } } }),
    db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { actor: { select: { name: true } } } }),
    db.progressPhoto.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { student: { include: { user: { select: { name: true } } } } } }),
  ]);

  const active = students.filter((s) => s.status === "ACTIVE");
  const recent = active.filter((s) => s.sessions[0] && s.sessions[0].finishedAt >= addDays(ref, -2)).sort((a, b) => b.sessions[0].finishedAt.getTime() - a.sessions[0].finishedAt.getTime());
  const idle = active.filter((s) => !s.sessions[0] || s.sessions[0].finishedAt < addDays(ref, -INACTIVE_DAYS));
  const late = openInvoices.filter((i) => invoiceStatus(i) === "ATRASO");
  const soon3 = openInvoices.filter((i) => i.dueDate >= ref && i.dueDate <= addDays(ref, 3));
  const upcoming = openInvoices.filter((i) => i.dueDate >= ref).slice(0, 6);
  const receivable = openInvoices.reduce((s, i) => s + i.amountCents, 0);

  return (
    <>
      <PageHeader
        eyebrow="Painel compartilhado da equipe"
        title={`Bom treino, ${user.name.split(" ")[0]}`}
        description="Todos os alunos da LOW UNITY JTA, as mesmas informações para os três treinadores."
        actions={
          <>
            <ButtonLink href="/admin/alunos/novo" variant="secondary"><Plus aria-hidden className="size-4" /> Aluno</ButtonLink>
            <ButtonLink href="/admin/treinos/novo"><Plus aria-hidden className="size-4" /> Treino</ButtonLink>
          </>
        }
      />

      {(late.length > 0 || soon3.length > 0) && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {late.length > 0 && (
            <Link href="/admin/financeiro?status=ATRASO" className="flex items-center gap-3 rounded-[var(--radius-card)] border border-brand/50 bg-brand-soft p-4 hover:border-brand">
              <AlertTriangle aria-hidden className="size-5 shrink-0 text-brand-text" />
              <p className="flex-1 text-sm font-semibold">{late.length} aluno{late.length > 1 ? "s estão" : " está"} com pagamento em atraso.</p>
              <ChevronRight aria-hidden className="size-4 text-brand-text" />
            </Link>
          )}
          {soon3.length > 0 && (
            <Link href="/admin/financeiro?status=A_VENCER" className="flex items-center gap-3 rounded-[var(--radius-card)] border border-warn/40 bg-warn-soft p-4 hover:border-warn">
              <Clock aria-hidden className="size-5 shrink-0 text-warn" />
              <p className="flex-1 text-sm font-semibold">{soon3.length} mensalidade{soon3.length > 1 ? "s vencem" : " vence"} nos próximos 3 dias.</p>
              <ChevronRight aria-hidden className="size-4 text-warn" />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total de alunos" value={students.length} icon={Users} />
        <Stat label="Alunos ativos" value={active.length} icon={UserCheck} tone="ok" />
        <Stat label="Treinos (30 dias)" value={sessions30} icon={Dumbbell} />
        <Stat label="A receber" value={brl(receivable)} icon={Wallet} hint={`${openInvoices.length} em aberto`} tone={late.length ? "brand" : undefined} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="h-recent">
          <SectionTitle id="h-recent">Treinaram recentemente</SectionTitle>
          <Card className="divide-y divide-line">
            {recent.length === 0 && <p className="p-4 text-sm text-muted">Nenhum treino nas últimas 48 horas.</p>}
            {recent.slice(0, 6).map((s) => (
              <StudentRow key={s.id} id={s.id} name={s.user.name} meta={`${s.sessions[0].workoutName} · ${fRelative(s.sessions[0].finishedAt)}`} />
            ))}
          </Card>
        </section>

        <section aria-labelledby="h-idle">
          <SectionTitle id="h-idle" action={<span className="text-sm text-muted">{idle.length}</span>}>Sem treinar há {INACTIVE_DAYS}+ dias</SectionTitle>
          <Card className="divide-y divide-line">
            {idle.length === 0 && <p className="p-4 text-sm text-muted">Todos os alunos ativos estão em dia.</p>}
            {idle.slice(0, 6).map((s) => (
              <StudentRow key={s.id} id={s.id} name={s.user.name} meta={s.sessions[0] ? `último treino ${fRelative(s.sessions[0].finishedAt)}` : "nunca treinou pelo app"} warn />
            ))}
          </Card>
        </section>

        <section aria-labelledby="h-due">
          <SectionTitle id="h-due" action={<MoreLink href="/admin/financeiro" />}>Próximos vencimentos</SectionTitle>
          <Card className="divide-y divide-line">
            {late.slice(0, 3).concat(upcoming).slice(0, 7).map((i) => (
              <Link key={i.id} href={`/admin/alunos/${i.studentId}?tab=financeiro`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{i.student.user.name}</p>
                  <p className="text-sm text-muted tnum">{brl(i.amountCents)} · {fDate(i.dueDate)}</p>
                </div>
                <StatusBadge status={invoiceStatus(i)} />
              </Link>
            ))}
            {openInvoices.length === 0 && <p className="p-4 text-sm text-muted">Nenhuma mensalidade em aberto.</p>}
          </Card>
        </section>

        <section aria-labelledby="h-photos">
          <SectionTitle id="h-photos" action={<MoreLink href="/admin/evolucao" />}>Novas fotos de evolução</SectionTitle>
          {photos.length === 0 ? (
            <Card className="flex items-center gap-3 p-4 text-sm text-muted"><Camera aria-hidden className="size-5" /> Nenhuma foto enviada ainda.</Card>
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/alunos/${p.studentId}?tab=evolucao`} className="block overflow-hidden rounded-xl border border-line bg-surface hover:border-line-strong">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/photos/${p.id}`} alt={`${ANGLES[p.angle]} de ${p.student.user.name}`} loading="lazy" className="aspect-square w-full object-cover" />
                    <p className="truncate px-2 py-1.5 text-xs font-semibold">{p.student.user.name.split(" ")[0]} · {fRelative(p.createdAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="h-activity" className="mt-8">
        <SectionTitle id="h-activity" action={<MoreLink href="/admin/atividades" />}>Atualizações recentes</SectionTitle>
        <Card className="divide-y divide-line">
          {activity.length === 0 && <p className="p-4 text-sm text-muted">Sem atividades registradas.</p>}
          {activity.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-4">
              <Avatar name={a.actor.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{a.description}</p>
                <p className="text-xs text-subtle tnum">{fDateTime(a.createdAt)}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </>
  );
}

function StudentRow({ id, name, meta, warn }: { id: string; name: string; meta: string; warn?: boolean }) {
  return (
    <Link href={`/admin/alunos/${id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
      <Avatar name={name} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className={warn ? "truncate text-sm text-warn" : "truncate text-sm text-muted"}>{meta}</p>
      </div>
      <ChevronRight aria-hidden className="size-4 text-subtle" />
    </Link>
  );
}

function MoreLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex h-9 items-center gap-1 text-sm font-semibold text-brand-text hover:underline">
      Ver tudo <ChevronRight aria-hidden className="size-4" />
    </Link>
  );
}
