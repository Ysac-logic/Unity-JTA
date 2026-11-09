// Baixa o catálogo da ExerciseDB (https://oss.exercisedb.dev) para prisma/data/exercisedb.json.
// Uso: npm run exercises:fetch
import { mkdir, writeFile } from "node:fs/promises";

const API = "https://oss.exercisedb.dev/api/v1/exercises";
const all = [];
let cursor = null;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 8) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status !== 429 && res.status < 500) throw new Error(`ExerciseDB ${res.status} em ${url}`);
    await wait(5000 * (i + 1));
  }
  throw new Error(`ExerciseDB indisponível: ${url}`);
}

do {
  const json = await get(`${API}?limit=100${cursor ? `&after=${cursor}` : ""}`);
  await wait(1500);
  all.push(...json.data);
  cursor = json.meta.hasNextPage ? json.meta.nextCursor : null;
  process.stdout.write(`\r${all.length}/${json.meta.total}`);
} while (cursor);

await mkdir(new URL("./data/", import.meta.url), { recursive: true });
await writeFile(new URL("./data/exercisedb.json", import.meta.url), JSON.stringify(all));
console.log(`\nSalvo: ${all.length} exercícios.`);
