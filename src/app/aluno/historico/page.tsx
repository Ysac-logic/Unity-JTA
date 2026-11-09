import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { HistoryList } from "@/components/history";

export const metadata = { title: "Histórico" };

export default async function StudentHistory() {
  const { student } = await requireStudent();
  return (
    <>
      <Link href="/aluno/treinos" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Meus treinos
      </Link>
      <PageHeader eyebrow="Treinos realizados" title="Histórico" />
      <HistoryList studentId={student.id} hrefBase="/aluno/historico" />
    </>
  );
}
