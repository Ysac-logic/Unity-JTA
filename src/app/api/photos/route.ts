import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canAccessStudent, getCurrentUser, isStaffRole } from "@/lib/auth";
import { savePhotoFile } from "@/lib/photos";
import { logActivity } from "@/lib/activity";
import { notifyStaff } from "@/lib/notify";
import { dateOnly, fDate, today } from "@/lib/dates";
import { ANGLES } from "@/lib/labels";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const fd = await req.formData();
  const studentId = String(fd.get("studentId") ?? user.student?.id ?? "");
  if (!studentId || !canAccessStudent(user, studentId)) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  const angle = String(fd.get("angle") ?? "");
  if (!ANGLES[angle]) return NextResponse.json({ error: "Escolha o ângulo da foto." }, { status: 400 });
  const takenAt = fd.get("takenAt") ? dateOnly(String(fd.get("takenAt"))) : today();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Selecione uma foto." }, { status: 400 });

  try {
    const filePath = await savePhotoFile(studentId, file);
    const photo = await db.progressPhoto.create({ data: { studentId, angle, takenAt, filePath, mimeType: file.type, uploadedById: user.id } });
    await logActivity({ actorId: user.id, action: "photo.upload", entityType: "photo", entityId: photo.id, studentId, description: `Foto de evolução (${ANGLES[angle]}, ${fDate(takenAt)}) enviada por ${user.name}.` });
    if (!isStaffRole(user.role)) {
      await notifyStaff({ type: "EVOLUTION", title: `${user.name.split(" ")[0]} enviou uma nova foto de evolução.`, body: `${ANGLES[angle]} · ${fDate(takenAt)}`, link: `/admin/alunos/${studentId}?tab=evolucao` });
    }
    return NextResponse.json({ id: photo.id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha no envio." }, { status: 400 });
  }
}
