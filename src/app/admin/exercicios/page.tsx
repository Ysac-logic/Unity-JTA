import Link from "next/link";
import { Plus, Search, Library, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { CATEGORIES } from "@/lib/exercisedb";
import { toggleExercise } from "@/app/actions/exercises";
import { ButtonLink, Card, EmptyState, Input, PageHeader, Tag, btn, cx } from "@/components/ui";
import { ExerciseGif } from "@/components/exercise-gif";

export const metadata = { title: "Exercícios" };
const PER_PAGE = 48;

export default async function ExerciseLibrary({ searchParams }: { searchParams: Promise<{ q?: string; g?: string; arquivados?: string; p?: string }> }) {
  await requireStaff();
  const { q = "", g = "", arquivados, p } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const where = { active: !arquivados, ...(g && { muscleGroup: g }), ...(q && { OR: [{ name: { contains: q } }, { targetMuscle: { contains: q } }, { equipment: { contains: q } }] }) };

  const [list, total, groups] = await Promise.all([
    db.exercise.findMany({ where, orderBy: [{ name: "asc" }], include: { _count: { select: { items: true } } }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.exercise.count({ where }),
    db.exercise.groupBy({ by: ["muscleGroup"], where: { active: !arquivados }, _count: true }),
  ]);
  const counts = Object.fromEntries(groups.map((x) => [x.muscleGroup, x._count]));
  const cats = [...CATEGORIES.filter((c) => counts[c]), ...Object.keys(counts).filter((c) => !(CATEGORIES as readonly string[]).includes(c))];
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const qs = (patch: Record<string, string | undefined>) => {
    const s = new URLSearchParams(Object.entries({ q, g, arquivados, ...patch }).filter(([, v]) => v) as [string, string][]);
    return `?${s}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca compartilhada"
        title="Exercícios"
        description={`${groups.reduce((s, x) => s + x._count, 0)} exercícios com demonstração em GIF, separados por parte do corpo.`}
        actions={<ButtonLink href="/admin/exercicios/novo"><Plus aria-hidden className="size-4" /> Novo exercício</ButtonLink>}
      />

      <form role="search" className="relative mb-4">
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input name="q" defaultValue={q} placeholder="Buscar por nome, músculo ou equipamento" aria-label="Buscar exercício" className="pl-10" />
        {g && <input type="hidden" name="g" value={g} />}
        {arquivados && <input type="hidden" name="arquivados" value="1" />}
      </form>

      <nav aria-label="Partes do corpo" className="mb-6 flex flex-wrap gap-1.5">
        {[["", "Todos"], ...cats.map((c) => [c, c])].map(([key, label]) => (
          <Link
            key={key || "all"}
            href={qs({ g: key || undefined, p: undefined })}
            aria-current={g === key ? "true" : undefined}
            className={cx("inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors", g === key ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-line-strong hover:text-fg")}
          >
            {label}
            {key && <span className={cx("text-xs tnum", g === key ? "text-white/75" : "text-subtle")}>{counts[key]}</span>}
          </Link>
        ))}
      </nav>

      {list.length === 0 ? (
        <EmptyState icon={Library} title="Nenhum exercício encontrado" action={<ButtonLink href="/admin/exercicios/novo">Cadastrar exercício</ButtonLink>} />
      ) : (
        <Card className="divide-y divide-line">
          {list.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3">
              <ExerciseGif name={e.name} gifUrl={e.gifUrl} muscleGroup={e.muscleGroup} targetMuscle={e.targetMuscle} equipment={e.equipment} instructions={e.instructions} size={60} />
              <Link href={`/admin/exercicios/${e.id}`} className="min-w-0 flex-1 hover:text-brand-text">
                <p className="truncate font-semibold">{e.name}</p>
                <p className="truncate text-sm text-muted">{[e.muscleGroup, e.targetMuscle, e.equipment].filter(Boolean).join(" · ")}</p>
              </Link>
              <div className="hidden items-center gap-2 text-subtle sm:flex">
                {e.videoUrl && <PlayCircle aria-label="Tem vídeo" className="size-4" />}
                {e._count.items > 0 && <Tag>{e._count.items} em treinos</Tag>}
              </div>
              <form action={toggleExercise.bind(null, e.id)}>
                <button type="submit" className={btn("ghost", "sm")}>{e.active ? "Arquivar" : "Reativar"}</button>
              </form>
            </div>
          ))}
        </Card>
      )}

      {pages > 1 && (
        <nav aria-label="Paginação" className="mt-6 flex items-center justify-between gap-3">
          <Link href={qs({ p: String(page - 1) })} aria-disabled={page === 1} className={cx(btn("secondary", "sm"), page === 1 && "pointer-events-none opacity-40")}>
            <ChevronLeft aria-hidden className="size-4" /> Anterior
          </Link>
          <span className="text-sm text-muted tnum">Página {page} de {pages} · {total} exercícios</span>
          <Link href={qs({ p: String(page + 1) })} aria-disabled={page === pages} className={cx(btn("secondary", "sm"), page === pages && "pointer-events-none opacity-40")}>
            Próxima <ChevronRight aria-hidden className="size-4" />
          </Link>
        </nav>
      )}

      <p className="mt-8 text-center text-sm">
        <Link href={arquivados ? "/admin/exercicios" : "/admin/exercicios?arquivados=1"} className="font-semibold text-muted hover:text-fg">
          {arquivados ? "Ver exercícios ativos" : "Ver exercícios arquivados"}
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-subtle">Demonstrações: ExerciseDB (oss.exercisedb.dev)</p>
    </>
  );
}
