"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyUser } from "@/lib/notify";
import { str } from "@/lib/labels";

export type WorkoutItemInput = { exerciseId: string; sets: number; reps: string; loadKg: number | null; restSeconds: number; notes: string | null };

export async function saveWorkout(_: { error?: string } | undefined, fd: FormData) {
  const actor = await requireStaff();
  const id = str(fd.get("id"));
  const studentId = String(fd.get("studentId") ?? "");
  const name = str(fd.get("name"));
  const day = str(fd.get("dayOfWeek"));
  let items: WorkoutItemInput[] = [];
  try {
    items = JSON.parse(String(fd.get("items") ?? "[]"));
  } catch {
    return { error: "Não foi possível ler a lista de exercícios." };
  }
  if (!studentId) return { error: "Selecione o aluno." };
  if (!name) return { error: "Dê um nome ao treino." };
  if (items.length === 0) return { error: "Adicione pelo menos um exercício." };

  const data = {
    name,
    label: str(fd.get("label")),
    dayOfWeek: day == null ? null : Number(day),
    notes: str(fd.get("notes")),
    updatedById: actor.id,
  };
  const rows = items.map((it, i) => ({
    exerciseId: it.exerciseId,
    position: i,
    sets: Math.max(1, Math.round(it.sets) || 1),
    reps: String(it.reps || "10").slice(0, 20),
    loadKg: it.loadKg ?? null,
    restSeconds: Math.max(0, Math.round(it.restSeconds) || 0),
    notes: it.notes || null,
  }));

  const student = await db.student.findUniqueOrThrow({ where: { id: studentId }, include: { user: true } });
  let workoutId = id;
  if (id) {
    await db.$transaction([
      db.workoutExercise.deleteMany({ where: { workoutId: id } }),
      db.workout.update({ where: { id }, data: { ...data, items: { create: rows } } }),
    ]);
    await notifyUser(student.userId, { type: "WORKOUT", title: `Seu treino foi atualizado por ${actor.name.split(" ")[0]}.`, body: name, link: `/aluno/treinos/${id}` });
    await logActivity({ actorId: actor.id, action: "workout.update", entityType: "workout", entityId: id, studentId, description: `Treino "${name}" de ${student.user.name} atualizado por ${actor.name}.` });
  } else {
    const count = await db.workout.count({ where: { studentId } });
    const w = await db.workout.create({ data: { ...data, studentId, position: count, createdById: actor.id, items: { create: rows } } });
    workoutId = w.id;
    await notifyUser(student.userId, { type: "WORKOUT", title: "Seu novo treino foi disponibilizado.", body: name, link: `/aluno/treinos/${w.id}` });
    await logActivity({ actorId: actor.id, action: "workout.create", entityType: "workout", entityId: w.id, studentId, description: `Treino "${name}" criado para ${student.user.name} por ${actor.name}.` });
  }
  revalidatePath("/aluno", "layout");
  redirect(`/admin/alunos/${studentId}?tab=treinos&saved=${workoutId}`);
}

export async function deleteWorkout(id: string) {
  const actor = await requireStaff();
  const w = await db.workout.delete({ where: { id }, include: { student: { include: { user: true } } } });
  await logActivity({ actorId: actor.id, action: "workout.delete", entityType: "workout", entityId: id, studentId: w.studentId, description: `Treino "${w.name}" de ${w.student.user.name} excluído por ${actor.name}.` });
  revalidatePath(`/admin/alunos/${w.studentId}`);
}

export async function toggleWorkout(id: string) {
  const actor = await requireStaff();
  const w = await db.workout.findUniqueOrThrow({ where: { id }, include: { student: { include: { user: true } } } });
  await db.workout.update({ where: { id }, data: { active: !w.active, updatedById: actor.id } });
  await logActivity({ actorId: actor.id, action: "workout.toggle", entityType: "workout", entityId: id, studentId: w.studentId, description: `Treino "${w.name}" de ${w.student.user.name} ${w.active ? "arquivado" : "reativado"} por ${actor.name}.` });
  revalidatePath(`/admin/alunos/${w.studentId}`);
}
