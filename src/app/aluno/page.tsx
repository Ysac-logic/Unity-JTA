import Link from "next/link";
import { ArrowRight, Flame, CalendarCheck, Activity, Trophy, Moon, ChevronRight, Award } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { studentStats, loadProgress } from "@/lib/stats";
import { todayAndNext, quoteOfDay } from "@/lib/workout-plan";
import { syncFinanceAlerts, invoiceStatus } from "@/lib/finance";
import { notifyUser } from "@/lib/notify";
import { addDays, fDate, fRelative, fWeekdayLong, today, WEEKDAYS, ymd } from "@/lib/dates";
import { brl, kg } from "@/lib/labels";
import { ButtonLink, Card, SectionTitle, Stat, StatusBadge, cx } from "@/components/ui";

export default async function StudentHome() {
  const { user, student } = await requireStudent();
  await syncFinanceAlerts();

  const [plan, stats, loads, weights, lastMeasure, lastPhoto, invoice] = await Promise.all([
    todayAndNext(student.id),
    studentStats(student.id),
    loadProgress(student.id),
    db.measurement.findMany({ where: { studentId: student.id, weightKg: { not: null } }, orderBy: { date: "desc" }, take: 2 }),
    db.measurement.findFirst({ where: { studentId: student.id }, orderBy: { date: "desc" } }),
    db.progressPhoto.findFirst({ where: { studentId: student.id }, orderBy: { takenAt: "desc" } }),
    db.invoice.findFirst({ where: { studentId: student.id, status: "OPEN" }, orderBy: { dueDate: "asc" } }),
  ]);

  if (plan.today) {
    await notifyUser(user.id, { type: "WORKOUT", title: "Seu treino de hoje está disponível.", body: plan.today.name, link: `/aluno/treinos/${plan.today.id}`, dedupeKey: `today:${student.id}:${ymd(new Date())}` });
  }
  const lastEvo = [lastMeasure?.date, lastPhoto?.takenAt].filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0];
  if (!lastEvo || lastEvo < addDays(today(), -30)) {
    await notifyUser(user.id, { type: "EVOLUTION", title: "Hora de registrar sua evolução.", body: "Atualize suas medidas e fotos para acompanhar o progresso.", link: "/aluno/evolucao", dedupeKey: `evo:${student.id}:${ymd(new Date()).slice(0, 7)}` });
  }

  const first = user.name.split(" ")[0];
  const w = plan.today;
  const weightDelta = weights.length === 2 ? (weights[0].weightKg ?? 0) - (weights[1].weightKg ?? 0) : null;
  const topLoad = loads.find((l) => l.points.length > 1) ?? loads[0];
  const status = invoice ? invoiceStatus(invoice) : null;
  const earned = stats.badges.filter((b) => b.earned);

  return (
    <div className="space-y-8">
      <section>
        <p className="eyebrow first-letter:uppercase">{fWeekdayLong(new Date())}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none">Olá, {first}!</h1>
        <p className="mt-2 text-muted">{w ? "Pronto para o treino de hoje?" : plan.isRestDay ? "Hoje é dia de recuperação." : "Sua equipe está preparando seu treino."}</p>
      </section>

      {w ? (
        <Card className="hero-grain relative overflow-hidden border-line-strong p-5 sm:p-6">
          <span aria-hidden className="absolute -right-6 top-0 h-full w-10 -skew-x-12 bg-brand/90" />
          <p className="eyebrow text-brand-text">Treino de hoje</p>
          <h2 className="mt-2 max-w-[85%] font-display text-3xl font-extrabold uppercase leading-[0.95] sm:text-4xl">
            {w.label && <span className="text-brand-text">Treino {w.label} · </span>}
            {w.name}
          </h2>
          <p className="mt-2 text-sm text-muted tnum">{w._count.items} exercícios</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <ButtonLink href={`/aluno/treinos/${w.id}/executar`} size="lg" className="w-full sm:w-auto">
              Começar treino <ArrowRight aria-hidden className="size-5" />
            </ButtonLink>
            <ButtonLink href={`/aluno/treinos/${w.id}`} variant="secondary" size="lg" className="w-full sm:w-auto">
              Ver exercícios
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <Card className="flex items-center gap-4 p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-2">
            <Moon aria-hidden className="size-5 text-muted" />
          </span>
          <div>
            <p className="font-semibold">{plan.isRestDay ? "Descanso programado" : "Nenhum treino disponível ainda"}</p>
            <p className="text-sm text-muted">{plan.isRestDay ? "Recuperar também é treinar. Hidrate-se e durma bem." : "Assim que a equipe publicar, ele aparece aqui."}</p>
          </div>
        </Card>
      )}

      <section aria-labelledby="h-consist">
        <SectionTitle id="h-consist">Sua constância</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Treinos concluídos" value={stats.total} icon={Trophy} hint={`${stats.last30} nos últimos 30 dias`} />
          <Stat label="Sequência" value={`${stats.streak} sem`} icon={Flame} tone={stats.streak > 0 ? "brand" : undefined} hint="semanas seguidas treinando" />
          <Stat label="Frequência" value={`${stats.consistency}%`} icon={Activity} hint={`meta ${stats.weeklyTarget}x por semana`} />
          <Stat label="Esta semana" value={`${stats.thisWeek}/${stats.weeklyTarget}`} icon={CalendarCheck} hint={stats.lastSession ? `último ${fRelative(stats.lastSession)}` : "nenhum ainda"} />
        </div>
      </section>

      {(weightDelta != null || topLoad) && (
        <section aria-labelledby="h-evo">
          <SectionTitle id="h-evo" action={<MoreLink href="/aluno/evolucao" />}>Evolução recente</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {weightDelta != null && (
              <Card className="p-4">
                <p className="text-[13px] font-medium text-muted">Peso corporal</p>
                <p className="mt-2 font-display text-3xl font-bold tnum">{kg(weights[0].weightKg)}</p>
                <p className="mt-1 text-[13px] text-subtle tnum">
                  {weightDelta > 0 ? "+" : ""}
                  {weightDelta.toFixed(1)} kg desde {fDate(weights[1].date)}
                </p>
              </Card>
            )}
            {topLoad && (
              <Card className="p-4">
                <p className="truncate text-[13px] font-medium text-muted">{topLoad.name}</p>
                <p className="mt-2 font-display text-2xl font-bold tnum">
                  {topLoad.points.slice(-4).map((p, i, a) => (
                    <span key={i}>
                      <span className={i === a.length - 1 ? "text-brand-text" : "text-muted"}>{p.value}</span>
                      {i < a.length - 1 && <span className="mx-1 text-subtle">→</span>}
                    </span>
                  ))}
                  <span className="ml-1 text-base text-muted">kg</span>
                </p>
                <p className="mt-1 text-[13px] text-subtle">evolução de carga</p>
              </Card>
            )}
          </div>
        </section>
      )}

      {plan.next && (
        <section aria-labelledby="h-next">
          <SectionTitle id="h-next">Próximo treino</SectionTitle>
          <Link href={`/aluno/treinos/${plan.next.id}`} className="group flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-line-strong">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{plan.next.dayOfWeek != null ? WEEKDAYS[plan.next.dayOfWeek] : `Treino ${plan.next.label ?? ""}`}</p>
              <p className="truncate font-semibold">{plan.next.name}</p>
            </div>
            <ChevronRight aria-hidden className="size-5 text-subtle transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      )}

      {invoice && status && status !== "PENDENTE" && (
        <Link href="/aluno/financeiro" className={cx("flex items-center justify-between gap-3 rounded-[var(--radius-card)] border p-4", status === "ATRASO" ? "border-brand/50 bg-brand-soft" : "border-line bg-surface")}>
          <div>
            <p className="text-sm font-semibold">{status === "ATRASO" ? "Mensalidade em atraso" : "Mensalidade próxima do vencimento"}</p>
            <p className="text-sm text-muted tnum">
              {brl(invoice.amountCents)} · vence {fDate(invoice.dueDate)}
            </p>
          </div>
          <StatusBadge status={status} />
        </Link>
      )}

      <section aria-labelledby="h-badges">
        <SectionTitle id="h-badges" action={<span className="text-sm text-muted tnum">{earned.length}/{stats.badges.length}</span>}>
          Conquistas
        </SectionTitle>
        <ul className="grid grid-cols-4 gap-2">
          {stats.badges.map((b) => (
            <li key={b.id} title={`${b.title}: ${b.description}`} className={cx("flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center", b.earned ? "border-brand/40 bg-brand-soft" : "border-line bg-surface opacity-55")}>
              <Award aria-hidden className={cx("size-6", b.earned ? "text-brand-text" : "text-subtle")} />
              <span className="text-[11px] font-semibold leading-tight">{b.title}</span>
              <span className="sr-only">{b.earned ? "conquistada" : "bloqueada"}. {b.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <blockquote className="border-l-2 border-brand pl-4 font-display text-xl font-semibold uppercase leading-tight text-muted">
        {quoteOfDay()}
      </blockquote>
    </div>
  );
}

function MoreLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex h-9 items-center gap-1 text-sm font-semibold text-brand-text hover:underline">
      Ver tudo <ChevronRight aria-hidden className="size-4" />
    </Link>
  );
}
