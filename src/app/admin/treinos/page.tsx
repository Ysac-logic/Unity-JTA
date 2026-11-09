import Link from "next/link";
import { Plus, Dumbbell, Search } from "lucide-react";
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
            <Link key={w.id} href={`/admin/treinos/${w.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 hover:bg-surface-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {w.label && <span className="text-brand-text">{w.label} · </span>}
                  {w.name}
                </p>
                <p className="truncate text-sm text-muted">{w.student.user.name}</p>
              </div>
              {w.dayOfWeek != null && <Tag>{WEEKDAYS[w.dayOfWeek]}</Tag>}
              <span className="text-sm text-muted tnum">{w._count.items} exercícios · {w._count.sessions} execuções</span>
              <span className="w-full text-xs text-subtle sm:w-auto">Atualizado {fRelative(w.updatedAt)}{w.updatedBy && ` por ${w.updatedBy.name.split(" ")[0]}`}</span>
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
