import Link from "next/link";
import { Plus, Dumbbell, Search, User } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { WEEKDAYS, fRelative } from "@/lib/dates";
import { ButtonLink, Card, EmptyState, Input, PageHeader, Tag } from "@/components/ui";

export const metadata = { title: "Treinos" };

export default async function AllWorkouts({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireStaff();
  const { q = "" } = await searchParams;
  const workouts = await db.workout.findMany({
    where: { active: true, student: { status: "ACTIVE" }, ...(q && { OR: [{ name: { contains: q } }, { student: { user: { name: { contains: q } } } }] }) },
    orderBy: { updatedAt: "desc" },
    include: { student: { include: { user: { select: { name: true } } } }, updatedBy: { select: { name: true } }, _count: { select: { items: true, sessions: true } } },
    take: 200,
  });

  return (
    <>
      <PageHeader eyebrow="Prescrições ativas" title="Treinos" description="Todos os treinos de todos os alunos. Qualquer treinador pode criar, editar ou substituir." actions={<ButtonLink href="/admin/treinos/novo"><Plus aria-hidden className="size-4" /> Novo treino</ButtonLink>} />
      <form role="search" className="relative mb-5">
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input name="q" defaultValue={q} placeholder="Buscar por treino ou aluno" aria-label="Buscar treinos" className="pl-10" />
      </form>
      {workouts.length === 0 ? (
        <EmptyState icon={Dumbbell} title="Nenhum treino encontrado" action={<ButtonLink href="/admin/treinos/novo">Criar treino</ButtonLink>} />
      ) : (
        <Card className="divide-y divide-line">
          {workouts.map((w) => (
            <Link key={w.id} href={`/admin/treinos/${w.id}`} className="flex flex-col gap-2 p-4 hover:bg-surface-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
              <div className="min-w-0 sm:flex-1">
                <p className="font-display text-lg leading-snug max-sm:break-words sm:truncate sm:text-base sm:font-semibold">
                  {w.label && <span className="text-brand-text">{w.label} · </span>}
                  {w.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[15px] font-semibold text-fg sm:text-sm sm:font-normal sm:text-muted">
                  <User aria-hidden className="size-4 shrink-0 text-brand-text sm:hidden" />
                  <span className="truncate">{w.student.user.name}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {w.dayOfWeek != null && <Tag>{WEEKDAYS[w.dayOfWeek]}</Tag>}
                <span className="text-sm text-muted tnum">{w._count.items} exercícios · {w._count.sessions} execuções</span>
              </div>
              <span className="text-xs text-subtle sm:w-auto">Atualizado {fRelative(w.updatedAt)}{w.updatedBy && ` por ${w.updatedBy.name.split(" ")[0]}`}</span>
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
