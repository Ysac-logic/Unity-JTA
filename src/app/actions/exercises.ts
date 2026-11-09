"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { str } from "@/lib/labels";

export async function saveExercise(_: { error?: string } | undefined, fd: FormData) {
  const actor = await requireStaff();
  const id = str(fd.get("id"));
  const name = str(fd.get("name"));
  const muscleGroup = str(fd.get("muscleGroup"));
  if (!name || !muscleGroup) return { error: "Nome e grupo muscular são obrigatórios." };
  const data = {
    name,
    muscleGroup,
    description: str(fd.get("description")),
    instructions: str(fd.get("instructions")),
    notes: str(fd.get("notes")),
    imageUrl: str(fd.get("imageUrl")),
    videoUrl: str(fd.get("videoUrl")),
    gifUrl: str(fd.get("gifUrl")),
  };
  const ex = id ? await db.exercise.update({ where: { id }, data }) : await db.exercise.create({ data });
  await logActivity({
    actorId: actor.id,
    action: id ? "exercise.update" : "exercise.create",
    entityType: "exercise",
    entityId: ex.id,
    description: `Exercício "${name}" ${id ? "editado" : "cadastrado"} por ${actor.name}.`,
  });
  revalidatePath("/admin/exercicios");
  redirect("/admin/exercicios");
}

export async function toggleExercise(id: string) {
  const actor = await requireStaff();
  const ex = await db.exercise.findUniqueOrThrow({ where: { id } });
  await db.exercise.update({ where: { id }, data: { active: !ex.active } });
  await logActivity({ actorId: actor.id, action: "exercise.toggle", entityType: "exercise", entityId: id, description: `Exercício "${ex.name}" ${ex.active ? "arquivado" : "reativado"} por ${actor.name}.` });
  revalidatePath("/admin/exercicios");
}
