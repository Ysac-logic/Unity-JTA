import Link from "next/link";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { fDateTime } from "@/lib/dates";
import { Avatar, Card, PageHeader, cx } from "@/components/ui";

export const metadata = { title: "Atividades" };

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ por?: string }> }) {
  await requireStaff();
  const { por } = await searchParams;
  const [staff, logs] = await Promise.all([
    db.user.findMany({ where: { role: { in: ["ADMIN", "TRAINER"] } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.activityLog.findMany({ where: por ? { actorId: por } : {}, orderBy: { createdAt: "desc" }, take: 200, include: { actor: { select: { name: true } } } }),
  ]);
  return (
    <>
      <PageHeader eyebrow="Histórico interno" title="Atividades" description="Quem fez o quê. Serve apenas para organização: não restringe o acesso de ninguém." />
      <nav aria-label="Filtrar por profissional" className="mb-4 flex flex-wrap gap-2">
        {[{ id: "", name: "Todos" }, ...staff].map((u) => (
          <Link key={u.id} href={u.id ? `?por=${u.id}` : "?"} aria-current={(por ?? "") === u.id ? "true" : undefined} className={cx("inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold", (por ?? "") === u.id ? "border-fg bg-fg text-bg" : "border-line text-muted hover:text-fg")}>
            {u.name.split(" ")[0]}
          </Link>
        ))}
      </nav>
      <Card className="divide-y divide-line">
        {logs.length === 0 && <p className="p-6 text-center text-sm text-muted">Sem atividades.</p>}
        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-3 p-4">
            <Avatar name={l.actor.name} size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-sm">{l.description}</p>
              <p className="text-xs text-subtle tnum">
                {fDateTime(l.createdAt)}
                {l.studentId && (
                  <>
                    {" · "}
                    <Link href={`/admin/alunos/${l.studentId}`} className="text-brand-text hover:underline">ver aluno</Link>
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
