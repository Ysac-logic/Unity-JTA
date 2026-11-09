import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Timer, Repeat, Weight, MessageSquareText } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { lastLoads } from "@/lib/last-loads";
import { WEEKDAYS, fRelative } from "@/lib/dates";
import { kg } from "@/lib/labels";
import { ButtonLink, Card, PageHeader, Tag } from "@/components/ui";
import { ExerciseMedia } from "@/components/exercise-media";
import { ExerciseGif } from "@/components/exercise-gif";

export default async function WorkoutDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { student } = await requireStudent();
  const w = await db.workout.findFirst({
    where: { id, studentId: student.id },
    include: { items: { orderBy: { position: "asc" }, include: { exercise: true } }, updatedBy: { select: { name: true } } },
  });
  if (!w) notFound();
  const last = await lastLoads(student.id, w.items.map((i) => i.exerciseId));

  return (
    <>
      <Link href="/aluno/treinos" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Meus treinos
      </Link>
      <PageHeader
        eyebrow={[w.dayOfWeek != null ? WEEKDAYS[w.dayOfWeek] : null, w.label ? `Treino ${w.label}` : null].filter(Boolean).join(" · ") || "Treino"}
        title={w.name}
        description={
          <>
            {w.items.length} exercícios · atualizado {fRelative(w.updatedAt)}
            {w.updatedBy && <> por {w.updatedBy.name.split(" ")[0]}</>}
          </>
        }
      />

      {w.notes && (
        <Card className="mb-6 flex gap-3 border-brand/30 bg-brand-soft p-4">
          <MessageSquareText aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-text" />
          <p className="text-sm whitespace-pre-line">{w.notes}</p>
        </Card>
      )}

      <ol className="space-y-3">
        {w.items.map((it, i) => (
          <li key={it.id}>
            <Card className="p-4">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
                  <ExerciseGif
                    name={it.exercise.name}
                    gifUrl={it.exercise.gifUrl}
                    muscleGroup={it.exercise.muscleGroup}
                    targetMuscle={it.exercise.targetMuscle}
                    equipment={it.exercise.equipment}
                    instructions={it.exercise.instructions}
                    size={64}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug"><span className="text-subtle tnum">{i + 1}. </span>{it.exercise.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{[it.exercise.muscleGroup, it.exercise.equipment].filter(Boolean).join(" · ")}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm tnum">
                      <span className="inline-flex items-center gap-1.5"><Repeat aria-hidden className="size-4 text-subtle" /> {it.sets} × {it.reps}</span>
                      <span className="inline-flex items-center gap-1.5"><Weight aria-hidden className="size-4 text-subtle" /> {kg(it.loadKg)}</span>
                      <span className="inline-flex items-center gap-1.5"><Timer aria-hidden className="size-4 text-subtle" /> {it.restSeconds}s</span>
                    </div>
                    {last[it.exerciseId] && <p className="mt-2 text-xs text-subtle tnum">Última vez: {kg(last[it.exerciseId].loadKg)}</p>}
                  </div>
                  <span className="mt-1 text-xs font-semibold text-brand-text group-open:hidden">Detalhes</span>
                  <span className="mt-1 hidden text-xs font-semibold text-muted group-open:inline">Fechar</span>
                </summary>
                <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
                  <ExerciseMedia name={it.exercise.name} imageUrl={it.exercise.imageUrl} videoUrl={it.exercise.videoUrl} />
                  {it.exercise.instructions && (
                    <div>
                      <p className="eyebrow mb-1">Instruções</p>
                      <p className="whitespace-pre-line text-muted">{it.exercise.instructions}</p>
                    </div>
                  )}
                  {it.notes && (
                    <div>
                      <p className="eyebrow mb-1">Observação da equipe</p>
                      <p className="whitespace-pre-line">{it.notes}</p>
                    </div>
                  )}
                  {!it.exercise.instructions && !it.notes && !it.exercise.imageUrl && !it.exercise.videoUrl && <Tag>Sem instruções adicionais</Tag>}
                </div>
              </details>
            </Card>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] mt-6 pb-2">
        <ButtonLink href={`/aluno/treinos/${w.id}/executar`} size="lg" className="w-full">
          Começar treino <ArrowRight aria-hidden className="size-5" />
        </ButtonLink>
      </div>
    </>
  );
}
