import { db } from "./db";
import { addMonths, diffDays, today, fDate } from "./dates";
import { notifyStaff, notifyUser } from "./notify";
import { brl } from "./labels";

import type { PayStatus } from "./pay-status";
export { PAY_STATUS, type PayStatus } from "./pay-status";

/** Janela (em dias) em que uma mensalidade em aberto passa a ser "A vencer". */
export const DUE_SOON_DAYS = 5;

export function invoiceStatus(inv: { status: string; dueDate: Date }, ref = today()): PayStatus {
  if (inv.status === "PAID") return "PAGO";
  if (inv.status === "CANCELED") return "CANCELADO";
  const d = diffDays(inv.dueDate, ref);
  if (d < 0) return "ATRASO";
  if (d <= DUE_SOON_DAYS) return "A_VENCER";
  return "PENDENTE";
}

export const reference = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

/** Garante que toda assinatura ativa possua a mensalidade do próximo vencimento. */
export async function syncInvoices() {
  const subs = await db.subscription.findMany({ where: { status: "ACTIVE", student: { status: "ACTIVE" } } });
  for (const s of subs) {
    await db.invoice.upsert({
      where: { subscriptionId_dueDate: { subscriptionId: s.id, dueDate: s.nextDueDate } },
      update: {},
      create: {
        subscriptionId: s.id,
        studentId: s.studentId,
        amountCents: s.amountCents,
        dueDate: s.nextDueDate,
        reference: reference(s.nextDueDate),
      },
    });
  }
}

/** Registra pagamento, quita a mensalidade e avança o ciclo mensal. */
export async function registerPayment(input: {
  invoiceId: string;
  amountCents: number;
  paidAt: Date;
  method: string;
  notes?: string | null;
  recordedById: string;
}) {
  const inv = await db.invoice.findUniqueOrThrow({ where: { id: input.invoiceId }, include: { subscription: { include: { plan: true } } } });
  await db.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId: inv.id,
        amountCents: input.amountCents,
        paidAt: input.paidAt,
        method: input.method,
        notes: input.notes,
        recordedById: input.recordedById,
      },
    });
    await tx.invoice.update({ where: { id: inv.id }, data: { status: "PAID", paidAt: input.paidAt, method: input.method } });
    const sub = inv.subscription;
    if (sub.status === "ACTIVE" && inv.dueDate.getTime() >= sub.nextDueDate.getTime()) {
      const next = addMonths(inv.dueDate, sub.plan?.intervalMonths ?? 1);
      await tx.subscription.update({ where: { id: sub.id }, data: { nextDueDate: next } });
      await tx.invoice.upsert({
        where: { subscriptionId_dueDate: { subscriptionId: sub.id, dueDate: next } },
        update: {},
        create: { subscriptionId: sub.id, studentId: sub.studentId, amountCents: sub.amountCents, dueDate: next, reference: reference(next) },
      });
    }
  });
  return inv;
}

/** Gera notificações financeiras (deduplicadas) para alunos e para a equipe. */
export async function syncFinanceAlerts() {
  await syncInvoices();
  const ref = today();
  const open = await db.invoice.findMany({
    where: { status: "OPEN", subscription: { status: "ACTIVE" } },
    include: { student: { include: { user: true } } },
  });
  for (const inv of open) {
    const d = diffDays(inv.dueDate, ref);
    const name = inv.student.user.name.split(" ")[0];
    const link = `/admin/alunos/${inv.studentId}?tab=financeiro`;
    if (d === 1) {
      await notifyUser(inv.student.userId, {
        type: "FINANCE",
        title: "Sua mensalidade vence amanhã.",
        body: `${brl(inv.amountCents)} · vencimento ${fDate(inv.dueDate)}`,
        link: "/aluno/financeiro",
        dedupeKey: `due1:${inv.id}`,
      });
      await notifyStaff({ type: "FINANCE", title: `A mensalidade de ${name} vence amanhã.`, link, dedupeKey: `staff-due1:${inv.id}` });
    }
    if (d < 0) {
      await notifyUser(inv.student.userId, {
        type: "FINANCE",
        title: "Sua mensalidade está pendente.",
        body: `Vencida em ${fDate(inv.dueDate)}. Fale com a equipe se precisar.`,
        link: "/aluno/financeiro",
        dedupeKey: `late:${inv.id}`,
      });
      await notifyStaff({ type: "FINANCE", title: `A mensalidade de ${name} está em atraso.`, link, dedupeKey: `staff-late:${inv.id}` });
    }
  }
}
