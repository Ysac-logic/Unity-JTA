import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Dumbbell, History } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { WEEKDAYS, addDays, today, weekdayIndex } from "@/lib/dates";
import { ButtonLink, EmptyState, PageHeader, Tag, cx } from "@/components/ui";

export const metadata: Metadata = { title: "Meus treinos" };
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default async function MyWorkouts() {
  const { student } = await requireStudent();
  const workouts = await db.workout.findMany({
    where: { studentId: student.id, active: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    include: { items: { include: { exercise: { select: { muscleGroup: true } } } } },
  });
  const todayIdx = weekdayIndex();
  const scheduled = workouts.some((w) => w.dayOfWeek != null);
  const unscheduled = workouts.filter((w) => w.dayOfWeek == null);

  const groups = (w: (typeof workouts)[number]) => [...new Set(w.items.map((i) => i.exercise.muscleGroup))].slice(0, 3).join(" · ");

  return (
    <>
      <PageHeader eyebrow="Sua divisão" title="Meus treinos" actions={<ButtonLink href="/aluno/historico" variant="secondary" size="sm"><History aria-hidden className="size-4" /> Histórico</ButtonLink>} />

      {scheduled && (
        <ol aria-label="Semana" className="mb-5 grid grid-cols-7 gap-1.5">
          {ORDER.map((d, n) => {
            const date = addDays(today(), n - ((todayIdx + 6) % 7));
            const isToday = d === todayIdx;
            return (
              <li key={d} className={cx("flex flex-col items-center rounded-xl border py-2 text-center", isToday ? "border-brand bg-brand text-fg" : "border-line bg-surface text-muted")}>
                <span className="text-[10px] font-medium">{WEEKDAYS[d].slice(0, 3)}</span>
                <span className="font-display text-base leading-tight tnum">{date.getUTCDate()}</span>
              </li>
            );
          })}
        </ol>
      )}

      {workouts.length === 0 ? (
        <EmptyState icon={Dumbbell} title="Nenhum treino publicado" description="A equipe LOW UNITY JTA vai disponibilizar seu treino em breve. Você será notificado." />
      ) : (
        <div className="space-y-8">
          {scheduled && (
            <ol className="space-y-2">
              {ORDER.map((d) => {
                const w = workouts.find((x) => x.dayOfWeek === d);
                const isToday = d === todayIdx;
                const inner = (
                  <div className="flex items-center gap-4">
                    <div className="w-20 shrink-0">
                      <p className={cx("font-display text-sm font-semibold", isToday ? "text-brand-text" : "text-subtle")}>{WEEKDAYS[d]}</p>
                      {isToday && <p className="text-[11px] font-semibold uppercase text-brand-text">Hoje</p>}
                    </div>
                    {w ? (
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {w.label && <span className="text-brand-text">Treino {w.label} — </span>}
                          {w.name}
                        </p>
                        <p className="truncate text-sm text-muted">{groups(w)} · {w.items.length} exercícios</p>
                      </div>
                    ) : (
                      <p className="flex-1 text-muted">Descanso</p>
                    )}
                    {w && <ChevronRight aria-hidden className="size-5 shrink-0 text-subtle" />}
                  </div>
                );
                return (
                  <li key={d}>
                    {w ? (
                      <Link href={`/aluno/treinos/${w.id}`} className={cx("block rounded-[var(--radius-card)] border p-4 transition-colors hover:border-line-strong", isToday ? "border-brand/50 bg-brand-soft" : "border-line bg-surface")}>
                        {inner}
                      </Link>
                    ) : (
                      <div className="rounded-[var(--radius-card)] border border-dashed border-line p-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {unscheduled.length > 0 && (
            <section>
              {scheduled && <h2 className="mb-3 font-display text-lg font-semibold">Outros treinos</h2>}
              <ul className="grid gap-2 sm:grid-cols-2">
                {unscheduled.map((w) => (
                  <li key={w.id}>
                    <Link href={`/aluno/treinos/${w.id}`} className="block h-full rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-line-strong">
                      {w.label && <Tag tone="brand">Treino {w.label}</Tag>}
                      <p className="mt-2 font-semibold">{w.name}</p>
                      <p className="text-sm text-muted">{groups(w)} · {w.items.length} exercícios</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}
