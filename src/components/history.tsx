import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { db } from "@/lib/db";
import { fDate, fDuration, fTime } from "@/lib/dates";
import { kg } from "@/lib/labels";
import { Card, EmptyState, cx } from "./ui";

export async function HistoryList({ studentId, hrefBase, limit = 60 }: { studentId: string; hrefBase: string; limit?: number }) {
  const sessions = await db.workoutSession.findMany({ where: { studentId }, orderBy: { finishedAt: "desc" }, take: limit });
  if (sessions.length === 0) return <EmptyState icon={History} title="Nenhum treino registrado" description="Os treinos concluídos aparecem aqui automaticamente." />;
  return (
    <ul className="space-y-2">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link href={`${hrefBase}/${s.id}`} className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-line-strong">
            <div className="w-14 shrink-0 text-center">
              <p className="font-display text-2xl font-bold leading-none tnum">{fDate(s.finishedAt).slice(0, 2)}</p>
              <p className="text-xs uppercase text-subtle">{new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Sao_Paulo" }).format(s.finishedAt).replace(".", "")}</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{s.workoutName}</p>
              <p className="text-sm text-muted tnum">
                {fTime(s.finishedAt)} · {fDuration(s.durationSec)} · {s.completedExercises}/{s.totalExercises} exercícios
              </p>
            </div>
            <span className={cx("font-display text-lg font-bold tnum", s.completionPct === 100 ? "text-brand-text" : "text-muted")}>{s.completionPct}%</span>
            <ChevronRight aria-hidden className="size-5 text-subtle" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function SessionDetail({ sessionId, studentId }: { sessionId: string; studentId: string }) {
  const s = await db.workoutSession.findFirst({ where: { id: sessionId, studentId }, include: { sets: { orderBy: [{ setNumber: "asc" }] } } });
  if (!s) return null;
  const byEx = new Map<string, { name: string; sets: typeof s.sets }>();
  for (const set of s.sets) {
    const e = byEx.get(set.exerciseId) ?? { name: set.exerciseName, sets: [] };
    e.sets.push(set);
    byEx.set(set.exerciseId, e);
  }
  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Data", fDate(s.finishedAt)],
          ["Horário", `${fTime(s.startedAt)}–${fTime(s.finishedAt)}`],
          ["Duração", fDuration(s.durationSec)],
          ["Conclusão", `${s.completionPct}%`],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <dt className="text-[13px] text-muted">{k}</dt>
            <dd className="mt-1 font-display text-xl font-bold tnum">{v}</dd>
          </Card>
        ))}
      </dl>
      <ul className="space-y-3">
        {[...byEx.entries()].map(([id, e]) => (
          <li key={id}>
            <Card className="p-4">
              <p className="font-semibold">{e.name}</p>
              <table className="mt-3 w-full text-sm tnum">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-subtle">
                    <th className="pb-2 font-semibold">Série</th>
                    <th className="pb-2 font-semibold">Carga</th>
                    <th className="pb-2 font-semibold">Reps</th>
                    <th className="pb-2 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {e.sets.map((x) => (
                    <tr key={x.id} className="border-t border-line">
                      <td className="py-2">{x.setNumber}</td>
                      <td className="py-2">{kg(x.loadKg)}</td>
                      <td className="py-2">{x.reps ?? "—"}</td>
                      <td className={cx("py-2 text-right", x.completed ? "text-ok" : "text-subtle")}>{x.completed ? "Feita" : "Não feita"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
