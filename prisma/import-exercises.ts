// Importa/atualiza o catálogo ExerciseDB no banco atual sem apagar dados.
// Uso: npm run exercises:import (rode antes npm run exercises:fetch para baixar a versão mais recente)
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { PT_NAMES, toExerciseRow, type ExerciseDbItem } from "../src/lib/exercisedb";

const db = new PrismaClient();
const catalog = JSON.parse(readFileSync(new URL("./data/exercisedb.json", import.meta.url), "utf8")) as ExerciseDbItem[];

const NAMES_PT = JSON.parse(readFileSync(new URL("./data/exercise-names-pt.json", import.meta.url), "utf8")) as Record<string, string>;

async function main() {
  let created = 0;
  for (const x of catalog) {
    const base = toExerciseRow(x);
    const row = { ...base, name: PT_NAMES[x.exerciseId] ?? NAMES_PT[x.exerciseId] ?? base.name };
    const exists = await db.exercise.findUnique({ where: { externalId: x.exerciseId }, select: { id: true, name: true } });
    if (exists) {
      await db.exercise.update({ where: { id: exists.id }, data: { ...(exists.name === base.name && { name: row.name }), gifUrl: row.gifUrl, muscleGroup: row.muscleGroup, targetMuscle: row.targetMuscle, equipment: row.equipment } });
    } else {
      await db.exercise.create({ data: row });
      created++;
    }
  }
  console.log(`Catálogo sincronizado: ${catalog.length} exercícios (${created} novos).`);
}

main().finally(() => db.$disconnect());
