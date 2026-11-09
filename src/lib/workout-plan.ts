import { db } from "./db";
import { weekdayIndex } from "./dates";

/** Treino de hoje (pelo dia da semana) e próximo treino da divisão (pela ordem, após o último realizado). */
export async function todayAndNext(studentId: string) {
  const workouts = await db.workout.findMany({
    where: { studentId, active: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { items: true } } },
  });
  if (workouts.length === 0) return { workouts, today: null, next: null, isRestDay: false };

  const dow = weekdayIndex();
  const scheduled = workouts.some((w) => w.dayOfWeek != null);
  const byDay = workouts.find((w) => w.dayOfWeek === dow) ?? null;

  const last = await db.workoutSession.findFirst({ where: { studentId }, orderBy: { finishedAt: "desc" }, select: { workoutId: true } });
  const lastIdx = workouts.findIndex((w) => w.id === last?.workoutId);
  const rotation = workouts[(lastIdx + 1) % workouts.length];

  const today = scheduled ? byDay : rotation;
  let next = rotation;
  if (scheduled) {
    for (let i = 1; i <= 7; i++) {
      const w = workouts.find((x) => x.dayOfWeek === (dow + i) % 7);
      if (w) {
        next = w;
        break;
      }
    }
  }
  return { workouts, today, next: next?.id === today?.id ? null : next, isRestDay: scheduled && !byDay };
}

const QUOTES = [
  "Constância vence motivação. Apareça hoje.",
  "Disciplina é escolher o que você quer mais, e não o que quer agora.",
  "Cada série conta. Cada treino soma.",
  "Evolução não é sorte. É repetição bem feita.",
  "O resultado é silencioso. O processo é diário.",
  "Treine com intenção. Descanse com propósito.",
  "Forte não se nasce. Forte se constrói.",
];

export const quoteOfDay = () => QUOTES[Math.floor(Date.now() / 86_400_000) % QUOTES.length];
