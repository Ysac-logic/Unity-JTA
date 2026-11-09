import { db } from "./db";
import { addDays, today, weekStart } from "./dates";

export type Badge = { id: string; title: string; description: string; earned: boolean };

/** Indicadores de constância e conquistas do aluno, derivados do histórico. */
export async function studentStats(studentId: string) {
  const [sessions, workouts, photos, measures] = await Promise.all([
    db.workoutSession.findMany({ where: { studentId }, select: { finishedAt: true, completionPct: true }, orderBy: { finishedAt: "desc" } }),
    db.workout.count({ where: { studentId, active: true } }),
    db.progressPhoto.count({ where: { studentId } }),
    db.measurement.count({ where: { studentId } }),
  ]);

  const total = sessions.length;
  const ref = today();
  const last30 = sessions.filter((s) => s.finishedAt >= addDays(ref, -30)).length;
  const weeklyTarget = Math.max(1, Math.min(workouts || 3, 6));
  const consistency = Math.min(100, Math.round((last30 / (weeklyTarget * (30 / 7))) * 100));

  const weeks = new Set(sessions.map((s) => weekStart(s.finishedAt).getTime()));
  let streak = 0;
  let cursor = weekStart(ref);
  if (!weeks.has(cursor.getTime())) cursor = addDays(cursor, -7);
  while (weeks.has(cursor.getTime())) {
    streak++;
    cursor = addDays(cursor, -7);
  }

  const thisWeek = sessions.filter((s) => s.finishedAt >= weekStart(ref)).length;

  const badges: Badge[] = [
    { id: "first", title: "Primeiro passo", description: "Concluiu o primeiro treino", earned: total >= 1 },
    { id: "t10", title: "10 treinos", description: "Dez treinos concluídos", earned: total >= 10 },
    { id: "t25", title: "25 treinos", description: "Constância virando hábito", earned: total >= 25 },
    { id: "t50", title: "50 treinos", description: "Disciplina comprovada", earned: total >= 50 },
    { id: "t100", title: "100 treinos", description: "Elite LOW UNITY", earned: total >= 100 },
    { id: "w4", title: "4 semanas seguidas", description: "Um mês sem quebrar a sequência", earned: streak >= 4 },
    { id: "photo", title: "Registro visual", description: "Enviou a primeira foto de evolução", earned: photos > 0 },
    { id: "measure", title: "Medidas em dia", description: "Registrou medidas corporais", earned: measures > 0 },
  ];

  return { total, last30, consistency, streak, thisWeek, weeklyTarget, lastSession: sessions[0]?.finishedAt ?? null, badges };
}

/** Evolução de carga máxima por sessão para cada exercício. */
export async function loadProgress(studentId: string) {
  const logs = await db.setLog.findMany({
    where: { session: { studentId }, loadKg: { not: null }, completed: true },
    select: { exerciseId: true, exerciseName: true, loadKg: true, session: { select: { id: true, finishedAt: true } } },
    orderBy: { session: { finishedAt: "asc" } },
  });
  const map = new Map<string, { name: string; points: Map<string, { date: Date; value: number }> }>();
  for (const l of logs) {
    const e = map.get(l.exerciseId) ?? { name: l.exerciseName, points: new Map() };
    const p = e.points.get(l.session.id);
    if (!p || (l.loadKg ?? 0) > p.value) e.points.set(l.session.id, { date: l.session.finishedAt, value: l.loadKg ?? 0 });
    map.set(l.exerciseId, e);
  }
  return [...map.entries()]
    .map(([id, e]) => ({ id, name: e.name, points: [...e.points.values()] }))
    .filter((e) => e.points.length > 0)
    .sort((a, b) => b.points.length - a.points.length);
}
