"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { notifyStaff, notifyUser } from "@/lib/notify";

export type SessionPayload = {
  workoutId: string;
  startedAt: string;
  finishedAt: string;
  exercises: { exerciseId: string; name: string; done: boolean; sets: { reps: number | null; loadKg: number | null; done: boolean }[] }[];
};

export async function finishSession(p: SessionPayload) {
  const { user, student } = await requireStudent();
  const workout = await db.workout.findFirst({ where: { id: p.workoutId, studentId: student.id } });
  if (!workout) throw new Error("Treino não encontrado.");

  const startedAt = new Date(p.startedAt);
  const finishedAt = new Date(p.finishedAt);
  const total = p.exercises.length;
  const completed = p.exercises.filter((e) => e.done || e.sets.some((s) => s.done)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const session = await db.workoutSession.create({
    data: {
      studentId: student.id,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt,
      finishedAt,
      durationSec: Math.max(0, Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000)),
      totalExercises: total,
      completedExercises: completed,
      completionPct: pct,
      sets: {
        create: p.exercises.flatMap((e) =>
          e.sets.map((s, i) => ({ exerciseId: e.exerciseId, exerciseName: e.name, setNumber: i + 1, reps: s.reps, loadKg: s.loadKg, completed: s.done })),
        ),
      },
    },
  });

  await notifyUser(user.id, { type: "SESSION", title: "Você completou seu treino!", body: `${workout.name} · ${pct}% concluído`, link: `/aluno/historico/${session.id}` });
  await notifyStaff({ type: "SESSION", title: `${user.name.split(" ")[0]} concluiu o treino ${workout.label ?? ""}`.trim() + ".", body: `${workout.name} · ${pct}%`, link: `/admin/alunos/${student.id}?tab=historico` });
  revalidatePath("/aluno", "layout");
  return { id: session.id };
}
