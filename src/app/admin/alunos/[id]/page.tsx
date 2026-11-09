import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Archive, Trash2, MessageCircle, Dumbbell, RotateCcw } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { studentStats } from "@/lib/stats";
import { invoiceStatus } from "@/lib/finance";
import { WEEKDAYS, addDays, fDate, fDateTime, fRelative, ymd } from "@/lib/dates";
import { GOALS } from "@/lib/labels";
import { addNote, updateStudent } from "@/app/actions/students";
import { deleteWorkout, toggleWorkout } from "@/app/actions/workouts";
import { resetUserPassword } from "@/app/actions/team";
import { Avatar, Button, ButtonLink, Card, EmptyState, Field, Input, SectionTitle, Select, Stat, StatusBadge, Tabs, Tag, Textarea, btn } from "@/components/ui";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { HistoryList } from "@/components/history";
import { EvolutionView } from "@/components/evolution";
import { FinanceView } from "@/components/finance-view";
import { wa } from "@/lib/team";

const TABS = [
  ["visao", "Visão geral"],
  ["treinos", "Treinos"],
  ["historico", "Histórico"],
  ["evolucao", "Evolução"],
  ["financeiro", "Financeiro"],
  ["observacoes", "Observações"],
  ["dados", "Dados"],
] as const;

export default async function StudentAdmin({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; saved?: string }> }) {
  const { id } = await params;
  const { tab = "visao", saved } = await searchParams;
  const actor = await requireStaff();
  const s = await db.student.findUnique({
    where: { id },
    include: { user: true, invoices: { where: { status: "OPEN" }, orderBy: { dueDate: "asc" }, take: 1 } },
  });
  if (!s) notFound();

  if (tab === "evolucao") {
    const already = await db.activityLog.findFirst({ where: { actorId: actor.id, studentId: id, action: "photo.view", createdAt: { gte: addDays(new Date(), -1) } } });
    const hasPhotos = await db.progressPhoto.count({ where: { studentId: id } });
    if (!already && hasPhotos) await logActivity({ actorId: actor.id, action: "photo.view", entityType: "photo", studentId: id, description: `Fotos de evolução de ${s.user.name} visualizadas por ${actor.name}.` });
  }

  const inv = s.invoices[0];
  const base = `/admin/alunos/${id}`;

  return (
    <>
      <Link href="/admin/alunos" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Alunos
      </Link>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar name={s.user.name} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">{s.user.name}</h1>
            {s.status === "INACTIVE" && <Tag>Inativo</Tag>}
            {inv && <StatusBadge status={invoiceStatus(inv)} />}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {s.goal === "OUTRO" && s.goalOther ? s.goalOther : GOALS[s.goal]} · desde {fDate(s.startDate)} · {s.user.email}
            {s.user.phone && ` · ${s.user.phone}`}
          </p>
        </div>
        <div className="flex gap-2">
          {s.user.phone && (
            <a href={wa(`55${s.user.phone}`, `Olá ${s.user.name.split(" ")[0]}! Aqui é ${actor.name}, da equipe LOW UNITY JTA.`)} target="_blank" rel="noopener noreferrer" className={btn("secondary")} aria-label={`WhatsApp de ${s.user.name}`}>
              <MessageCircle aria-hidden className="size-4" /><span className="sm:hidden lg:inline">WhatsApp</span>
            </a>
          )}
          <ButtonLink href={`/admin/treinos/novo?aluno=${id}`}><Plus aria-hidden className="size-4" /> Treino</ButtonLink>
        </div>
      </header>

      <Tabs active={tab} items={TABS.map(([k, l]) => ({ key: k, label: l, href: `${base}?tab=${k}` }))} />

      {tab === "visao" && <Overview studentId={id} info={s.info} />}
      {tab === "treinos" && <Workouts studentId={id} saved={saved} />}
      {tab === "historico" && <HistoryList studentId={id} hrefBase={`${base}/historico`} />}
      {tab === "evolucao" && <EvolutionView studentId={id} />}
      {tab === "financeiro" && <FinanceView studentId={id} staff />}
      {tab === "observacoes" && <Notes studentId={id} />}
      {tab === "dados" && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="p-4 sm:p-6">
            <form action={updateStudent.bind(null, id)} className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome"><Input name="name" defaultValue={s.user.name} required /></Field>
              <Field label="Telefone"><Input name="phone" type="tel" defaultValue={s.user.phone ?? ""} /></Field>
              <Field label="Data de nascimento"><Input name="birthDate" type="date" defaultValue={s.birthDate ? ymd(s.birthDate) : ""} /></Field>
              <Field label="Data de início"><Input name="startDate" type="date" defaultValue={ymd(s.startDate)} /></Field>
              <Field label="Objetivo">
                <Select name="goal" defaultValue={s.goal}>{Object.entries(GOALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
              </Field>
              <Field label="Objetivo (se outro)"><Input name="goalOther" defaultValue={s.goalOther ?? ""} /></Field>
              <Field label="Situação">
                <Select name="status" defaultValue={s.status}><option value="ACTIVE">Ativo</option><option value="INACTIVE">Inativo</option></Select>
              </Field>
              <Field label="Informações relevantes" className="sm:col-span-2"><Textarea name="info" defaultValue={s.info ?? ""} /></Field>
              <div className="sm:col-span-2"><Button type="submit">Salvar alterações</Button></div>
            </form>
          </Card>
          <Card className="h-fit p-4 sm:p-6">
            <p className="mb-3 font-semibold">Redefinir senha do aluno</p>
            <form action={resetUserPassword.bind(null, s.userId)} className="space-y-3">
              <Field label="Nova senha" hint="Mínimo de 6 caracteres."><Input name="password" minLength={6} required autoComplete="off" /></Field>
              <Button type="submit" variant="secondary">Redefinir</Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

async function Overview({ studentId, info }: { studentId: string; info: string | null }) {
  const [stats, notes, activity] = await Promise.all([
    studentStats(studentId),
    db.note.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, take: 3, include: { author: { select: { name: true } } } }),
    db.activityLog.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, take: 6, include: { actor: { select: { name: true } } } }),
  ]);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Treinos concluídos" value={stats.total} hint={`${stats.last30} em 30 dias`} />
        <Stat label="Frequência" value={`${stats.consistency}%`} hint={`meta ${stats.weeklyTarget}x/semana`} />
        <Stat label="Sequência" value={`${stats.streak} sem`} tone={stats.streak ? "brand" : undefined} />
        <Stat label="Último treino" value={stats.lastSession ? fRelative(stats.lastSession) : "—"} />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle>Treinos recentes</SectionTitle>
          <HistoryList studentId={studentId} hrefBase={`/admin/alunos/${studentId}/historico`} limit={5} />
        </section>
        <div className="space-y-8">
          {info && (
            <section>
              <SectionTitle>Informações relevantes</SectionTitle>
              <Card className="p-4 text-sm whitespace-pre-line">{info}</Card>
            </section>
          )}
          <section>
            <SectionTitle action={<Link href={`?tab=observacoes`} className="text-sm font-semibold text-brand-text hover:underline">Todas</Link>}>Observações da equipe</SectionTitle>
            <Card className="divide-y divide-line">
              {notes.length === 0 && <p className="p-4 text-sm text-muted">Nenhuma observação.</p>}
              {notes.map((n) => (
                <div key={n.id} className="p-4">
                  <p className="text-sm whitespace-pre-line">{n.body}</p>
                  <p className="mt-1 text-xs text-subtle">{n.author.name} · {fDateTime(n.createdAt)}</p>
                </div>
              ))}
            </Card>
          </section>
          <section>
            <SectionTitle>Registro de alterações</SectionTitle>
            <Card className="divide-y divide-line">
              {activity.map((a) => (
                <div key={a.id} className="p-4">
                  <p className="text-sm">{a.description}</p>
                  <p className="mt-0.5 text-xs text-subtle tnum">{fDateTime(a.createdAt)}</p>
                </div>
              ))}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

async function Workouts({ studentId, saved }: { studentId: string; saved?: string }) {
  const workouts = await db.workout.findMany({
    where: { studentId },
    orderBy: [{ active: "desc" }, { position: "asc" }, { createdAt: "asc" }],
    include: { items: { orderBy: { position: "asc" }, include: { exercise: { select: { name: true } } } }, updatedBy: { select: { name: true } } },
  });
  if (workouts.length === 0) {
    return <EmptyState icon={Dumbbell} title="Nenhum treino criado" description="Monte o primeiro treino. Ele fica disponível para o aluno imediatamente." action={<ButtonLink href={`/admin/treinos/novo?aluno=${studentId}`}>Criar treino</ButtonLink>} />;
  }
  return (
    <>
      {saved && <p role="status" className="mb-4 rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">Treino salvo e disponível para o aluno.</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {workouts.map((w) => (
          <li key={w.id}>
            <Card className={w.active ? "h-full p-4" : "h-full p-4 opacity-60"}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap gap-1.5">
                    {w.label && <Tag tone="brand">Treino {w.label}</Tag>}
                    {w.dayOfWeek != null && <Tag>{WEEKDAYS[w.dayOfWeek]}</Tag>}
                    {!w.active && <Tag>Arquivado</Tag>}
                  </div>
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-xs text-subtle">Atualizado {fRelative(w.updatedAt)}{w.updatedBy && ` por ${w.updatedBy.name}`}</p>
                </div>
                <div className="flex shrink-0">
                  <ButtonLink href={`/admin/treinos/${w.id}`} variant="ghost" size="sm" aria-label={`Editar ${w.name}`}><Pencil className="size-4" /></ButtonLink>
                  <form action={toggleWorkout.bind(null, w.id)}>
                    <Button type="submit" variant="ghost" size="sm" aria-label={w.active ? `Arquivar ${w.name}` : `Reativar ${w.name}`}>{w.active ? <Archive className="size-4" /> : <RotateCcw className="size-4" />}</Button>
                  </form>
                  <form action={deleteWorkout.bind(null, w.id)}>
                    <ConfirmSubmit message={`Excluir o treino "${w.name}"? O histórico de treinos realizados é mantido.`} className={btn("ghost", "sm")} aria-label={`Excluir ${w.name}`}><Trash2 className="size-4" /></ConfirmSubmit>
                  </form>
                </div>
              </div>
              <ol className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
                {w.items.map((it, i) => (
                  <li key={it.id} className="flex justify-between gap-3">
                    <span className="truncate"><span className="text-subtle tnum">{i + 1}.</span> {it.exercise.name}</span>
                    <span className="shrink-0 text-muted tnum">{it.sets}×{it.reps}{it.loadKg != null && ` · ${it.loadKg}kg`}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}

async function Notes({ studentId }: { studentId: string }) {
  const notes = await db.note.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } });
  return (
    <div className="max-w-2xl space-y-4">
      <Card className="p-4">
        <form action={addNote.bind(null, studentId)} className="space-y-3">
          <Field label="Nova observação" hint="Visível somente para a equipe."><Textarea name="body" required /></Field>
          <Button type="submit">Adicionar observação</Button>
        </form>
      </Card>
      <Card className="divide-y divide-line">
        {notes.length === 0 && <p className="p-4 text-sm text-muted">Nenhuma observação ainda.</p>}
        {notes.map((n) => (
          <div key={n.id} className="flex gap-3 p-4">
            <Avatar name={n.author.name} size={32} />
            <div>
              <p className="text-sm whitespace-pre-line">{n.body}</p>
              <p className="mt-1 text-xs text-subtle">Observação adicionada por {n.author.name} · {fDateTime(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
