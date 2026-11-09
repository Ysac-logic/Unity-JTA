import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { invoiceStatus } from "@/lib/finance";
import { fRelative } from "@/lib/dates";
import { GOALS } from "@/lib/labels";
import { Avatar, ButtonLink, Card, EmptyState, Input, PageHeader, StatusBadge, Tag, cx } from "@/components/ui";

export const metadata = { title: "Alunos" };

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireStaff();
  const { q = "", status = "ACTIVE" } = await searchParams;
  const students = await db.student.findMany({
    where: {
      ...(status !== "ALL" && { status }),
      ...(q && { user: { OR: [{ name: { contains: q } }, { email: { contains: q } }] } }),
    },
    orderBy: { user: { name: "asc" } },
    include: {
      user: { select: { name: true, email: true } },
      sessions: { orderBy: { finishedAt: "desc" }, take: 1, select: { finishedAt: true } },
      invoices: { where: { status: "OPEN" }, orderBy: { dueDate: "asc" }, take: 1 },
      _count: { select: { workouts: { where: { active: true } } } },
    },
  });

  const filters = [["ACTIVE", "Ativos"], ["INACTIVE", "Inativos"], ["ALL", "Todos"]];

  return (
    <>
      <PageHeader eyebrow="Base compartilhada" title="Alunos" description={`${students.length} aluno${students.length === 1 ? "" : "s"} · acessíveis pelos três treinadores`} actions={<ButtonLink href="/admin/alunos/novo"><Plus aria-hidden className="size-4" /> Cadastrar aluno</ButtonLink>} />

      <form className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center" role="search">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input name="q" defaultValue={q} placeholder="Buscar por nome ou e-mail" aria-label="Buscar alunos" className="pl-10" />
          <input type="hidden" name="status" value={status} />
        </div>
        <div className="flex gap-1 rounded-xl border border-line bg-surface p-1">
          {filters.map(([k, l]) => (
            <Link key={k} href={`?status=${k}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={status === k ? "true" : undefined} className={cx("inline-flex h-10 flex-1 items-center justify-center rounded-lg px-4 text-sm font-semibold", status === k ? "bg-surface-3 text-fg" : "text-muted hover:text-fg")}>
              {l}
            </Link>
          ))}
        </div>
      </form>

      {students.length === 0 ? (
        <EmptyState icon={Users} title={q ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"} description={q ? "Tente outro termo de busca." : "Cadastre o primeiro aluno da consultoria."} action={!q && <ButtonLink href="/admin/alunos/novo">Cadastrar aluno</ButtonLink>} />
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_8rem] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-subtle md:grid">
            <span>Aluno</span><span>Objetivo</span><span>Último treino</span><span>Mensalidade</span>
          </div>
          {students.map((s) => {
            const inv = s.invoices[0];
            return (
              <Link key={s.id} href={`/admin/alunos/${s.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3.5 hover:bg-surface-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_8rem]">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={s.user.name} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.user.name} {s.status === "INACTIVE" && <Tag>Inativo</Tag>}</p>
                    <p className="truncate text-sm text-muted">{s.user.email}</p>
                  </div>
                </div>
                <span className="hidden truncate text-sm md:block">{GOALS[s.goal]}</span>
                <span className="hidden text-sm text-muted md:block">{s.sessions[0] ? fRelative(s.sessions[0].finishedAt) : "—"}</span>
                <span className="justify-self-end md:justify-self-start">{inv ? <StatusBadge status={invoiceStatus(inv)} /> : <span className="text-sm text-subtle">Sem plano</span>}</span>
                <p className="col-span-2 pl-[52px] text-xs text-subtle md:hidden">
                  {GOALS[s.goal]} · {s._count.workouts} treinos · {s.sessions[0] ? `treinou ${fRelative(s.sessions[0].finishedAt)}` : "sem treinos"}
                </p>
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}
