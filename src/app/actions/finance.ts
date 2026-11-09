"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff, requireStudent } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyStaff, notifyUser } from "@/lib/notify";
import { registerPayment, reference } from "@/lib/finance";
import { addMonths, dateOnly, fDate, today } from "@/lib/dates";
import { brl, METHODS, str, toCents } from "@/lib/labels";

function refresh(studentId: string) {
  revalidatePath("/admin/financeiro");
  revalidatePath(`/admin/alunos/${studentId}`);
  revalidatePath("/aluno/financeiro");
}

export async function recordPayment(_: { error?: string; ok?: boolean } | undefined, fd: FormData) {
  const actor = await requireStaff();
  const invoiceId = String(fd.get("invoiceId") ?? "");
  const amountCents = toCents(fd.get("amount"));
  const method = String(fd.get("method") ?? "PIX");
  if (!invoiceId) return { error: "Selecione a mensalidade." };
  if (amountCents <= 0) return { error: "Informe um valor válido." };
  const paidAt = str(fd.get("paidAt")) ? dateOnly(String(fd.get("paidAt"))) : today();

  const inv = await registerPayment({ invoiceId, amountCents, paidAt, method, notes: str(fd.get("notes")), recordedById: actor.id });
  const student = await db.student.findUniqueOrThrow({ where: { id: inv.studentId }, include: { user: true } });
  await notifyUser(student.userId, { type: "FINANCE", title: "Pagamento confirmado.", body: `${brl(amountCents)} · ${METHODS[method]} · ${fDate(paidAt)}`, link: "/aluno/financeiro" });
  await logActivity({ actorId: actor.id, action: "payment.create", entityType: "invoice", entityId: inv.id, studentId: inv.studentId, description: `Pagamento de ${student.user.name} (${brl(amountCents)}, ${METHODS[method]}) registrado por ${actor.name}.` });
  refresh(inv.studentId);
  return { ok: true };
}

/** Aluno avisa a equipe sobre a forma de pagamento escolhida. Nenhum dado de cartão é enviado ao servidor. */
export async function reportPayment(invoiceId: string, method: "PIX" | "CARTAO" | "BOLETO") {
  const { user, student } = await requireStudent();
  const inv = await db.invoice.findFirst({ where: { id: invoiceId, studentId: student.id, status: "OPEN" } });
  if (!inv) return { error: "Mensalidade não encontrada." };
  const first = user.name.split(" ")[0];
  const title = {
    PIX: `${first} informou pagamento via Pix.`,
    CARTAO: `${first} quer pagar com cartão de crédito.`,
    BOLETO: `${first} solicitou boleto.`,
  }[method];
  await notifyStaff({
    type: "FINANCE",
    title,
    body: `${brl(inv.amountCents)} · vencimento ${fDate(inv.dueDate)}${method === "PIX" ? " · confirmar recebimento" : ""}`,
    link: `/admin/alunos/${student.id}?tab=financeiro`,
    dedupeKey: `report:${inv.id}:${method}:${today().toISOString().slice(0, 10)}`,
  });
  await logActivity({ actorId: user.id, action: "payment.report", entityType: "invoice", entityId: inv.id, studentId: student.id, description: `${user.name} escolheu pagar via ${METHODS[method]} (${brl(inv.amountCents)}).` });
  return { ok: true };
}

export async function saveSubscription(studentId: string, fd: FormData) {
  const actor = await requireStaff();
  const amountCents = toCents(fd.get("amount"));
  if (amountCents <= 0) return;
  const nextDue = str(fd.get("nextDueDate")) ? dateOnly(String(fd.get("nextDueDate"))) : addMonths(today(), 1);
  const method = String(fd.get("method") ?? "PIX");
  const notes = str(fd.get("notes"));
  const planId = str(fd.get("planId"));

  const current = await db.subscription.findFirst({ where: { studentId, status: "ACTIVE" } });
  if (current) {
    await db.subscription.update({ where: { id: current.id }, data: { amountCents, nextDueDate: nextDue, paymentMethod: method, notes, planId } });
    await db.invoice.updateMany({ where: { subscriptionId: current.id, status: "OPEN" }, data: { amountCents } });
  } else {
    const startDate = str(fd.get("startDate")) ? dateOnly(String(fd.get("startDate"))) : today();
    await db.subscription.create({ data: { studentId, planId, amountCents, startDate, firstDueDate: nextDue, nextDueDate: nextDue, paymentMethod: method, notes } });
  }
  const sub = await db.subscription.findFirstOrThrow({ where: { studentId, status: "ACTIVE" } });
  await db.invoice.upsert({
    where: { subscriptionId_dueDate: { subscriptionId: sub.id, dueDate: nextDue } },
    update: {},
    create: { subscriptionId: sub.id, studentId, amountCents, dueDate: nextDue, reference: reference(nextDue) },
  });
  await db.invoice.updateMany({ where: { subscriptionId: sub.id, status: "OPEN", dueDate: { gt: nextDue } }, data: { status: "CANCELED" } });

  const s = await db.student.findUniqueOrThrow({ where: { id: studentId }, include: { user: true } });
  await logActivity({ actorId: actor.id, action: "subscription.save", entityType: "subscription", entityId: sub.id, studentId, description: `Mensalidade de ${s.user.name} definida em ${brl(amountCents)} (vencimento ${fDate(nextDue)}) por ${actor.name}.` });
  refresh(studentId);
}

export async function cancelSubscription(studentId: string) {
  const actor = await requireStaff();
  const sub = await db.subscription.findFirst({ where: { studentId, status: "ACTIVE" }, include: { student: { include: { user: true } } } });
  if (!sub) return;
  await db.subscription.update({ where: { id: sub.id }, data: { status: "CANCELED", canceledAt: new Date() } });
  await db.invoice.updateMany({ where: { subscriptionId: sub.id, status: "OPEN", dueDate: { gte: today() } }, data: { status: "CANCELED" } });
  await logActivity({ actorId: actor.id, action: "subscription.cancel", entityType: "subscription", entityId: sub.id, studentId, description: `Plano de ${sub.student.user.name} cancelado por ${actor.name}.` });
  refresh(studentId);
}

export async function cancelInvoice(invoiceId: string) {
  const actor = await requireStaff();
  const inv = await db.invoice.update({ where: { id: invoiceId }, data: { status: "CANCELED" }, include: { student: { include: { user: true } } } });
  await logActivity({ actorId: actor.id, action: "invoice.cancel", entityType: "invoice", entityId: invoiceId, studentId: inv.studentId, description: `Mensalidade ${fDate(inv.dueDate)} de ${inv.student.user.name} cancelada por ${actor.name}.` });
  refresh(inv.studentId);
}
