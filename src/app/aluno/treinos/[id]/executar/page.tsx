import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { lastLoads } from "@/lib/last-loads";
import { WorkoutRunner, type RunExercise } from "./runner";

export const metadata = { title: "Treino em andamento" };

export default async function RunWorkout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { student } = await requireStudent();
  const w = await db.workout.findFirst({
    where: { id, studentId: student.id, active: true },
    include: { items: { orderBy: { position: "asc" }, include: { exercise: true } } },
  });
  if (!w || w.items.length === 0) notFound();
  const last = await lastLoads(student.id, w.items.map((i) => i.exerciseId));

  const exercises: RunExercise[] = w.items.map((it) => ({
    exerciseId: it.exerciseId,
    name: it.exercise.name,
    muscleGroup: it.exercise.muscleGroup,
    sets: it.sets,
    reps: it.reps,
    loadKg: it.loadKg,
    lastLoadKg: last[it.exerciseId]?.loadKg ?? null,
    restSeconds: it.restSeconds,
    notes: it.notes,
    instructions: it.exercise.instructions,
    gifUrl: it.exercise.gifUrl,
    targetMuscle: it.exercise.targetMuscle,
    equipment: it.exercise.equipment,
  }));

  return <WorkoutRunner workoutId={w.id} workoutName={w.name} label={w.label} exercises={exercises} />;
}
