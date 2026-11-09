import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { SessionDetail } from "@/components/history";

export default async function AdminSession({ params }: { params: Promise<{ id: string; sid: string }> }) {
  const { id, sid } = await params;
  await requireStaff();
  const s = await db.workoutSession.findFirst({ where: { id: sid, studentId: id }, include: { student: { include: { user: { select: { name: true } } } } } });
  if (!s) notFound();
  return (
    <>
      <Link href={`/admin/alunos/${id}?tab=historico`} className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> {s.student.user.name}
      </Link>
      <PageHeader eyebrow="Treino realizado" title={s.workoutName} />
      <SessionDetail sessionId={sid} studentId={id} />
    </>
  );
}
