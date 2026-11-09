import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { WorkoutBuilder } from "../builder";

export const metadata = { title: "Novo treino" };

export default async function NewWorkout({ searchParams }: { searchParams: Promise<{ aluno?: string; copiar?: string }> }) {
  await requireStaff();
  const { aluno, copiar } = await searchParams;
  const [students, exercises, source] = await Promise.all([
    db.student.findMany({ where: { status: "ACTIVE" }, include: { user: { select: { name: true } } }, orderBy: { user: { name: "asc" } } }),
    db.exercise.findMany({ where: { active: true }, orderBy: [{ muscleGroup: "asc" }, { name: "asc" }], select: { id: true, name: true, muscleGroup: true, gifUrl: true, targetMuscle: true, equipment: true } }),
    copiar ? db.workout.findUnique({ where: { id: copiar }, include: { items: { orderBy: { position: "asc" } } } }) : null,
  ]);
  return (
    <>
      <Link href={aluno ? `/admin/alunos/${aluno}?tab=treinos` : "/admin/treinos"} className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Voltar
      </Link>
      <PageHeader eyebrow="Prescrição" title={source ? "Copiar treino" : "Novo treino"} description="Ao salvar, o treino fica disponível para o aluno imediatamente." />
      <WorkoutBuilder
        students={students.map((s) => ({ id: s.id, name: s.user.name }))}
        exercises={exercises}
        initial={{
          studentId: aluno,
          name: source?.name,
          label: source?.label,
          dayOfWeek: source?.dayOfWeek,
          notes: source?.notes,
          items: source?.items.map((i) => ({ exerciseId: i.exerciseId, sets: i.sets, reps: i.reps, loadKg: i.loadKg, restSeconds: i.restSeconds, notes: i.notes })) ?? [],
        }}
      />
    </>
  );
}
