import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { addMonths, today, ymd } from "@/lib/dates";
import { PageHeader } from "@/components/ui";
import { NewStudentForm } from "./form";

export const metadata = { title: "Cadastrar aluno" };

export default async function NewStudent() {
  await requireStaff();
  const plans = await db.plan.findMany({ where: { active: true }, orderBy: { priceCents: "asc" } });
  return (
    <>
      <Link href="/admin/alunos" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Alunos
      </Link>
      <PageHeader eyebrow="Novo aluno da equipe" title="Cadastrar aluno" description="O aluno passa a ser acompanhado pelos três treinadores da LOW UNITY JTA." />
      <NewStudentForm plans={plans.map((p) => ({ id: p.id, name: p.name, price: p.priceCents / 100 }))} start={ymd(today())} firstDue={ymd(addMonths(today(), 1))} />
    </>
  );
}
