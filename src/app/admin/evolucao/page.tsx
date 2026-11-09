import Link from "next/link";
import { Camera, Ruler } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { fDate, fRelative } from "@/lib/dates";
import { ANGLES, kg } from "@/lib/labels";
import { Card, EmptyState, PageHeader, SectionTitle } from "@/components/ui";

export const metadata = { title: "Evolução" };

export default async function EvolutionFeed() {
  await requireStaff();
  const [photos, measures] = await Promise.all([
    db.progressPhoto.findMany({ orderBy: { createdAt: "desc" }, take: 36, include: { student: { include: { user: { select: { name: true } } } } } }),
    db.measurement.findMany({ orderBy: { createdAt: "desc" }, take: 15, include: { student: { include: { user: { select: { name: true } } } } } }),
  ]);

  const byStudent = new Map<string, typeof photos>();
  for (const p of photos) byStudent.set(p.studentId, [...(byStudent.get(p.studentId) ?? []), p]);

  return (
    <>
      <PageHeader eyebrow="Acompanhamento físico" title="Evolução" description="Fotos e medidas enviadas pelos alunos, visíveis para toda a equipe. Privadas para outros alunos." />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="h-ph">
          <SectionTitle id="h-ph">Fotos recentes</SectionTitle>
          {photos.length === 0 ? (
            <EmptyState icon={Camera} title="Nenhuma foto enviada" description="Quando um aluno enviar fotos, elas aparecem aqui automaticamente." />
          ) : (
            <div className="space-y-4">
              {[...byStudent.entries()].map(([sid, list]) => (
                <Card key={sid} className="p-4">
                  <Link href={`/admin/alunos/${sid}?tab=evolucao`} className="mb-3 flex items-baseline justify-between gap-2 hover:text-brand-text">
                    <span className="font-semibold">{list[0].student.user.name}</span>
                    <span className="text-xs text-subtle">enviada {fRelative(list[0].createdAt)}</span>
                  </Link>
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {list.slice(0, 6).map((p) => (
                      <li key={p.id}>
                        <Link href={`/admin/alunos/${sid}?tab=evolucao`} className="block overflow-hidden rounded-lg border border-line">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/api/photos/${p.id}`} alt={`${ANGLES[p.angle]} de ${p.student.user.name} em ${fDate(p.takenAt)}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                        </Link>
                        <p className="mt-1 text-[11px] text-muted tnum">{ANGLES[p.angle]} · {fDate(p.takenAt).slice(0, 5)}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="h-me">
          <SectionTitle id="h-me">Medidas recentes</SectionTitle>
          {measures.length === 0 ? (
            <EmptyState icon={Ruler} title="Sem medidas" />
          ) : (
            <Card className="divide-y divide-line">
              {measures.map((m) => (
                <Link key={m.id} href={`/admin/alunos/${m.studentId}?tab=evolucao#medidas`} className="block p-4 hover:bg-surface-2">
                  <p className="font-semibold">{m.student.user.name}</p>
                  <p className="text-sm text-muted tnum">
                    {fDate(m.date)}
                    {m.weightKg != null && ` · ${kg(m.weightKg)}`}
                    {m.waistCm != null && ` · cintura ${m.waistCm} cm`}
                  </p>
                </Link>
              ))}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
