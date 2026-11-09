import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { syncInvoices } from "@/lib/finance";
import { fDate } from "@/lib/dates";
import { brl } from "@/lib/labels";
import { PIX_HOLDER, PIX_KEY, TEAM, wa } from "@/lib/team";
import { PageHeader } from "@/components/ui";
import { FinanceView } from "@/components/finance-view";
import { PaymentOptions } from "@/components/payment-options";

export const metadata = { title: "Financeiro" };

export default async function MyFinance() {
  const { user, student } = await requireStudent();
  await syncInvoices();
  const open = await db.invoice.findFirst({ where: { studentId: student.id, status: "OPEN" }, orderBy: { dueDate: "asc" } });

  return (
    <>
      <PageHeader eyebrow="Plano mensal" title="Financeiro" />
      <FinanceView
        studentId={student.id}
        pay={
          open && (
            <PaymentOptions
              invoiceId={open.id}
              amount={brl(open.amountCents)}
              due={fDate(open.dueDate)}
              studentName={user.name}
              pixKey={PIX_KEY}
              pixHolder={PIX_HOLDER}
              whatsappLink={wa(TEAM[0].whatsapp, `Olá! Aqui é ${user.name}. Sobre minha mensalidade de ${brl(open.amountCents)} (vencimento ${fDate(open.dueDate)}).`)}
            />
          )
        }
      />
    </>
  );
}
