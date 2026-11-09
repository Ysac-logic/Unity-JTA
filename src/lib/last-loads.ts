import { db } from "./db";

/** Última carga registrada pelo aluno em cada exercício. */
export async function lastLoads(studentId: string, exerciseIds: string[]) {
  const logs = await db.setLog.findMany({
    where: { exerciseId: { in: exerciseIds }, session: { studentId }, loadKg: { not: null } },
    orderBy: { session: { finishedAt: "desc" } },
    select: { exerciseId: true, loadKg: true, reps: true },
  });
  const map: Record<string, { loadKg: number; reps: number | null }> = {};
  for (const l of logs) if (!map[l.exerciseId] && l.loadKg != null) map[l.exerciseId] = { loadKg: l.loadKg, reps: l.reps };
  return map;
}
