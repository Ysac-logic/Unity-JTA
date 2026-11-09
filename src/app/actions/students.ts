"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { addMonths, dateOnly, today } from "@/lib/dates";
import { str, toCents } from "@/lib/labels";
import { reference } from "@/lib/finance";

export async function createStudent(_: { error?: string } | undefined, fd: FormData) {
  const actor = await requireStaff();
  const name = str(fd.get("name"));
  const email = str(fd.get("email"))?.toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!name || !email) return { error: "Nome e e-mail são obrigatórios." };
  if (password.length < 6) return { error: "A senha inicial precisa ter pelo menos 6 caracteres." };
  if (await db.user.findUnique({ where: { email } })) return { error: "Já existe um usuário com este e-mail." };

  const startDate = str(fd.get("startDate")) ? dateOnly(String(fd.get("startDate"))) : today();
  const amountCents = toCents(fd.get("amount"));
  const firstDue = str(fd.get("firstDueDate")) ? dateOnly(String(fd.get("firstDueDate"))) : addMonths(startDate, 1);
  const planId = str(fd.get("planId"));

  const student = await db.student.create({
    data: {
      goal: String(fd.get("goal") ?? "HIPERTROFIA"),
      goalOther: str(fd.get("goalOther")),
      birthDate: str(fd.get("birthDate")) ? dateOnly(String(fd.get("birthDate"))) : null,
      startDate,
      info: str(fd.get("info")),
      user: { create: { name, email, phone: str(fd.get("phone")), role: "STUDENT", passwordHash: await bcrypt.hash(password, 10) } },
    },
  });

  if (amountCents > 0) {
    const sub = await db.subscription.create({
      data: {
        studentId: student.id,
        planId,
        amountCents,
        startDate,
        firstDueDate: firstDue,
        nextDueDate: firstDue,
        paymentMethod: String(fd.get("method") ?? "PIX"),
        notes: str(fd.get("financeNotes")),
      },
    });
    await db.invoice.create({
      data: { subscriptionId: sub.id, studentId: student.id, amountCents, dueDate: firstDue, reference: reference(firstDue) },
    });
  }

  await logActivity({ actorId: actor.id, action: "student.create", entityType: "student", entityId: student.id, studentId: student.id, description: `Aluno ${name} cadastrado por ${actor.name}.` });
  redirect(`/admin/alunos/${student.id}`);
}

export async function updateStudent(studentId: string, fd: FormData) {
  const actor = await requireStaff();
  const s = await db.student.update({
    where: { id: studentId },
    data: {
      goal: String(fd.get("goal") ?? "HIPERTROFIA"),
      goalOther: str(fd.get("goalOther")),
      birthDate: str(fd.get("birthDate")) ? dateOnly(String(fd.get("birthDate"))) : null,
      startDate: str(fd.get("startDate")) ? dateOnly(String(fd.get("startDate"))) : undefined,
      info: str(fd.get("info")),
      status: String(fd.get("status") ?? "ACTIVE"),
      user: { update: { name: String(fd.get("name")), phone: str(fd.get("phone")) } },
    },
    include: { user: true },
  });
  await logActivity({ actorId: actor.id, action: "student.update", entityType: "student", entityId: studentId, studentId, description: `Perfil de ${s.user.name} atualizado por ${actor.name}.` });
  revalidatePath(`/admin/alunos/${studentId}`);
}

export async function addNote(studentId: string, fd: FormData) {
  const actor = await requireStaff();
  const body = str(fd.get("body"));
  if (!body) return;
  await db.note.create({ data: { studentId, authorId: actor.id, body } });
  await logActivity({ actorId: actor.id, action: "note.create", entityType: "note", studentId, description: `Observação adicionada por ${actor.name}.` });
  revalidatePath(`/admin/alunos/${studentId}`);
}
