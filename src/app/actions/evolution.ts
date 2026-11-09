"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { canAccessStudent, isStaffRole, requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyStaff } from "@/lib/notify";
import { dateOnly, fDate, today } from "@/lib/dates";
import { MEASURES, str, toNum } from "@/lib/labels";
import { deletePhotoFile } from "@/lib/photos";

export async function addMeasurement(studentId: string, fd: FormData) {
  const user = await requireUser();
  if (!canAccessStudent(user, studentId)) throw new Error("Acesso negado.");

  const values = Object.fromEntries(MEASURES.map((m) => [m.key, toNum(fd.get(m.key))]));
  const customLabel = str(fd.get("customLabel"));
  const customValue = toNum(fd.get("customValue"));
  const custom = customLabel && customValue != null ? JSON.stringify([{ label: customLabel, value: customValue, unit: str(fd.get("customUnit")) ?? "cm" }]) : null;
  if (Object.values(values).every((v) => v == null) && !custom) return;

  const date = str(fd.get("date")) ? dateOnly(String(fd.get("date"))) : today();
  await db.measurement.create({ data: { studentId, date, ...values, custom, notes: str(fd.get("notes")), recordedById: user.id } });

  const student = await db.student.findUniqueOrThrow({ where: { id: studentId }, include: { user: true } });
  await logActivity({ actorId: user.id, action: "measurement.create", entityType: "measurement", studentId, description: `Medidas de ${student.user.name} (${fDate(date)}) atualizadas por ${user.name}.` });
  if (!isStaffRole(user.role)) {
    await notifyStaff({ type: "EVOLUTION", title: `${user.name.split(" ")[0]} registrou novas medidas.`, link: `/admin/alunos/${studentId}?tab=evolucao` });
  }
  revalidatePath("/aluno/evolucao");
  revalidatePath(`/admin/alunos/${studentId}`);
}

export async function deletePhoto(photoId: string) {
  const user = await requireUser();
  const photo = await db.progressPhoto.findUniqueOrThrow({ where: { id: photoId } });
  if (!canAccessStudent(user, photo.studentId)) throw new Error("Acesso negado.");
  await db.progressPhoto.delete({ where: { id: photoId } });
  await deletePhotoFile(photo.filePath);
  await logActivity({ actorId: user.id, action: "photo.delete", entityType: "photo", entityId: photoId, studentId: photo.studentId, description: `Foto de evolução de ${fDate(photo.takenAt)} removida por ${user.name}.` });
  revalidatePath("/aluno/evolucao");
  revalidatePath(`/admin/alunos/${photo.studentId}`);
}
