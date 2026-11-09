import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { SessionDetail } from "@/components/history";

export default async function StudentSession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { student } = await requireStudent();
  const s = await db.workoutSession.findFirst({ where: { id, studentId: student.id }, select: { workoutName: true } });
  if (!s) notFound();
  return (
    <>
      <Link href="/aluno/historico" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Histórico
      </Link>
      <PageHeader eyebrow="Treino realizado" title={s.workoutName} />
      <SessionDetail sessionId={id} studentId={student.id} />
    </>
  );
}
