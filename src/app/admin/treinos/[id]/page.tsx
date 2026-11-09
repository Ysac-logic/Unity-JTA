import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { fRelative } from "@/lib/dates";
import { ButtonLink, PageHeader } from "@/components/ui";
import { WorkoutBuilder } from "../builder";

export const metadata = { title: "Editar treino" };

export default async function EditWorkout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireStaff();
  const [w, exercises] = await Promise.all([
    db.workout.findUnique({ where: { id }, include: { items: { orderBy: { position: "asc" } }, student: { include: { user: { select: { name: true } } } }, updatedBy: { select: { name: true } } } }),
    db.exercise.findMany({ where: { active: true }, orderBy: [{ muscleGroup: "asc" }, { name: "asc" }], select: { id: true, name: true, muscleGroup: true, gifUrl: true, targetMuscle: true, equipment: true } }),
  ]);
  if (!w) notFound();
  const extra = await db.exercise.findMany({ where: { id: { in: w.items.map((i) => i.exerciseId) }, active: false }, select: { id: true, name: true, muscleGroup: true, gifUrl: true, targetMuscle: true, equipment: true } });

  return (
    <>
      <Link href={`/admin/alunos/${w.studentId}?tab=treinos`} className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> {w.student.user.name}
      </Link>
      <PageHeader
        eyebrow={`Treino de ${w.student.user.name}`}
        title={w.name}
        description={`Atualizado ${fRelative(w.updatedAt)}${w.updatedBy ? ` por ${w.updatedBy.name}` : ""}. Qualquer treinador da equipe pode editar.`}
        actions={<ButtonLink href={`/admin/treinos/novo?copiar=${w.id}`} variant="secondary"><Copy aria-hidden className="size-4" /> Copiar para outro aluno</ButtonLink>}
      />
      <WorkoutBuilder
        students={[{ id: w.studentId, name: w.student.user.name }]}
        exercises={[...exercises, ...extra]}
        initial={{
          id: w.id,
          studentId: w.studentId,
          name: w.name,
          label: w.label,
          dayOfWeek: w.dayOfWeek,
          notes: w.notes,
          items: w.items.map((i) => ({ exerciseId: i.exerciseId, sets: i.sets, reps: i.reps, loadKg: i.loadKg, restSeconds: i.restSeconds, notes: i.notes })),
        }}
      />
    </>
  );
}
