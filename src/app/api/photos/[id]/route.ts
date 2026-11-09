import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canAccessStudent, getCurrentUser, isStaffRole } from "@/lib/auth";
import { readPhotoFile } from "@/lib/photos";
import { logActivity } from "@/lib/activity";
import { fDate } from "@/lib/dates";

/** Entrega privada: somente o próprio aluno e a equipe LOW UNITY JTA. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Não autenticado.", { status: 401 });

  const photo = await db.progressPhoto.findUnique({ where: { id }, include: { student: { include: { user: true } } } });
  if (!photo || !canAccessStudent(user, photo.studentId)) return new NextResponse("Não encontrado.", { status: 404 });

  if (isStaffRole(user.role) && new URL(req.url).searchParams.get("log") === "1") {
    await logActivity({ actorId: user.id, action: "photo.view", entityType: "photo", entityId: id, studentId: photo.studentId, description: `Foto de evolução de ${photo.student.user.name} (${fDate(photo.takenAt)}) visualizada por ${user.name}.` });
  }

  try {
    const buf = await readPhotoFile(photo.filePath);
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": photo.mimeType, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new NextResponse("Arquivo indisponível.", { status: 404 });
  }
}
