import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { PT_NAMES, toExerciseRow, type ExerciseDbItem } from "../src/lib/exercisedb";

const db = new PrismaClient();
const DAY = 86_400_000;
const d = (s: string) => new Date(`${s}T12:00:00.000Z`);
const ymd = (x: Date) => x.toISOString().slice(0, 10);
const addMonths = (x: Date, n: number) => new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + n, x.getUTCDate(), 12));
const ref = (x: Date) => ymd(x).slice(0, 7);
const now = new Date();
const daysAgo = (n: number, h = 19) => {
  const x = new Date(now.getTime() - n * DAY);
  x.setUTCHours(h + 3, 0, 0, 0);
  return x;
};

async function main() {
  await db.$transaction([
    db.activityLog.deleteMany(), db.notification.deleteMany(), db.payment.deleteMany(), db.invoice.deleteMany(),
    db.subscription.deleteMany(), db.plan.deleteMany(), db.note.deleteMany(), db.message.deleteMany(),
    db.progressPhoto.deleteMany(), db.measurement.deleteMany(), db.setLog.deleteMany(), db.workoutSession.deleteMany(),
    db.workoutExercise.deleteMany(), db.workout.deleteMany(), db.exercise.deleteMany(), db.student.deleteMany(), db.user.deleteMany(),
  ]);

  const hash = await bcrypt.hash("123456", 10);
  const admin = await db.user.create({ data: { name: "Administrador LOW UNITY", email: "admin@lowunity.com", role: "ADMIN", passwordHash: hash } });
  const tallison = await db.user.create({ data: { name: "Tallison", email: "tallison@lowunity.com", role: "TRAINER", passwordHash: hash, phone: "(11) 90000-0001" } });
  const adrian = await db.user.create({ data: { name: "Adrian", email: "adrian@lowunity.com", role: "TRAINER", passwordHash: hash, phone: "(11) 90000-0002" } });
  const joalison = await db.user.create({ data: { name: "Joalison", email: "joalison@lowunity.com", role: "TRAINER", passwordHash: hash, phone: "(11) 90000-0003" } });
  const team = [tallison, adrian, joalison];

  const catalog = JSON.parse(readFileSync(new URL("./data/exercisedb.json", import.meta.url), "utf8")) as ExerciseDbItem[];
  await db.exercise.createMany({ data: catalog.map((x) => ({ ...toExerciseRow(x), ...(PT_NAMES[x.exerciseId] && { name: PT_NAMES[x.exerciseId] }) })) });
  const ex: Record<string, string> = {};
  for (const e of await db.exercise.findMany({ where: { externalId: { in: Object.keys(PT_NAMES) } } })) ex[e.name] = e.id;

  const plan = await db.plan.create({ data: { name: "Consultoria mensal", priceCents: 15000, intervalMonths: 1, description: "Treino online com acompanhamento da equipe" } });

  type Item = [string, number, string, number | null, number];
  const SPLITS: Record<string, { label: string; name: string; day: number; items: Item[] }> = {
    A: { label: "A", name: "Peito + Tríceps", day: 1, items: [["Supino reto com barra", 4, "8-10", 30, 90], ["Supino inclinado com halteres", 3, "10", 14, 75], ["Crucifixo na máquina", 3, "12", 35, 60], ["Tríceps pulley", 3, "12", 20, 60], ["Tríceps francês com halter", 3, "10", 12, 60]] },
    B: { label: "B", name: "Costas + Bíceps", day: 2, items: [["Puxada frontal", 4, "10", 45, 90], ["Remada curvada com barra", 3, "10", 30, 90], ["Remada baixa no cabo", 3, "12", 40, 60], ["Rosca direta com barra", 3, "10", 20, 60], ["Rosca martelo", 3, "12", 10, 60]] },
    C: { label: "C", name: "Pernas", day: 4, items: [["Agachamento livre", 4, "8", 50, 120], ["Leg press 45°", 4, "12", 140, 90], ["Cadeira extensora", 3, "12", 40, 60], ["Mesa flexora", 3, "12", 30, 60], ["Panturrilha em pé na máquina", 4, "15", 50, 45]] },
    D: { label: "D", name: "Ombros + Abdômen", day: 5, items: [["Desenvolvimento com halteres", 4, "10", 14, 90], ["Elevação lateral", 3, "12", 8, 60], ["Crucifixo invertido", 3, "12", 6, 60], ["Abdominal", 3, "20", null, 45], ["Prancha com carga", 3, "40s", null, 45]] },
  };

  const STUDENTS = [
    { name: "João Silva", email: "joao@email.com", goal: "HIPERTROFIA", start: "2026-08-05", splits: ["A", "B", "C", "D"], sessions: 22, weight: [82, 81.2, 80.4, 79.8], lastPaid: ["2026-09-05", "2026-10-05"], nextDue: "2026-11-05", lastSessionDaysAgo: 1 },
    { name: "Maria Souza", email: "maria@email.com", goal: "EMAGRECIMENTO", start: "2026-07-27", splits: ["A", "B", "C"], sessions: 14, weight: [71, 69.6, 68.5], lastPaid: ["2026-08-27", "2026-09-27"], nextDue: "2026-10-27", lastSessionDaysAgo: 0 },
    { name: "Ana Lima", email: "ana@email.com", goal: "SAUDE", start: "2026-09-08", splits: ["C", "D"], sessions: 6, weight: [63, 62.4], lastPaid: ["2026-10-08"], nextDue: "2026-11-08", lastSessionDaysAgo: 3 },
    { name: "Pedro Alves", email: "pedro@email.com", goal: "FORCA", start: "2026-06-20", splits: ["A", "B", "C"], sessions: 9, weight: [90, 90.5], lastPaid: ["2026-07-20", "2026-08-20", "2026-09-20"], nextDue: "2026-10-20", lastSessionDaysAgo: 8 },
    { name: "Carla Mendes", email: "carla@email.com", goal: "CONDICIONAMENTO", start: "2026-10-12", splits: ["A", "C"], sessions: 2, weight: [58], lastPaid: [], nextDue: "2026-11-12", lastSessionDaysAgo: 2 },
  ];

  for (const [si, S] of STUDENTS.entries()) {
    const student = await db.student.create({
      data: {
        goal: S.goal,
        startDate: d(S.start),
        birthDate: d(`19${90 + si}-0${(si % 9) + 1}-15`),
        info: si === 3 ? "Histórico de dor lombar. Evitar carga máxima no agachamento sem aquecimento." : null,
        user: { create: { name: S.name, email: S.email, role: "STUDENT", passwordHash: hash, phone: `(11) 9${si}111-22${si}3` } },
      },
      include: { user: true },
    });
    const author = team[si % 3];

    const workouts = [];
    for (const [pos, key] of S.splits.entries()) {
      const sp = SPLITS[key];
      const w = await db.workout.create({
        data: {
          studentId: student.id, name: sp.name, label: sp.label, dayOfWeek: sp.day, position: pos,
          notes: pos === 0 ? "Aqueça 5 minutos antes. Mantenha 1–2 repetições em reserva na última série." : null,
          createdById: author.id, updatedById: team[(si + pos) % 3].id,
          items: { create: sp.items.map(([n, sets, reps, load, rest], i) => ({ exerciseId: ex[n], position: i, sets, reps, loadKg: load, restSeconds: rest, notes: i === 0 ? "Foco na técnica antes de subir carga." : null })) },
        },
        include: { items: { include: { exercise: true } } },
      });
      workouts.push(w);
    }

    for (let k = 0; k < S.sessions; k++) {
      const w = workouts[k % workouts.length];
      const ago = S.lastSessionDaysAgo + (S.sessions - 1 - k) * 2;
      const progress = k / Math.max(1, S.sessions - 1);
      const startedAt = daysAgo(ago, 18);
      const dur = 2900 + ((k * 137) % 1500);
      const finishedAt = new Date(startedAt.getTime() + dur * 1000);
      const skip = k % 5 === 4 ? 1 : 0;
      await db.workoutSession.create({
        data: {
          studentId: student.id, workoutId: w.id, workoutName: w.name, startedAt, finishedAt, durationSec: dur,
          totalExercises: w.items.length, completedExercises: w.items.length - skip, completionPct: Math.round(((w.items.length - skip) / w.items.length) * 100),
          sets: {
            create: w.items.flatMap((it, ii) =>
              Array.from({ length: it.sets }, (_, s) => ({
                exerciseId: it.exerciseId, exerciseName: it.exercise.name, setNumber: s + 1,
                reps: parseInt(it.reps) || 10,
                loadKg: it.loadKg == null ? null : Math.round((it.loadKg * (0.7 + 0.35 * progress)) / 2.5) * 2.5,
                completed: !(skip && ii === w.items.length - 1),
              })),
            ),
          },
        },
      });
    }

    for (const [mi, wgt] of S.weight.entries()) {
      const date = addMonths(d(S.start), mi);
      if (date > now) break;
      await db.measurement.create({ data: { studentId: student.id, date, weightKg: wgt, waistCm: 88 - si * 4 - mi * 1.2, abdomenCm: 92 - si * 4 - mi * 1.5, hipCm: 100 - si, armCm: 34 + mi * 0.4, thighCm: 58 + mi * 0.3, calfCm: 37, recordedById: mi % 2 ? student.userId : author.id } });
    }

    const sub = await db.subscription.create({
      data: { studentId: student.id, planId: plan.id, amountCents: 15000, startDate: d(S.start), firstDueDate: d(S.lastPaid[0] ?? S.nextDue), nextDueDate: d(S.nextDue), paymentMethod: si % 2 ? "CARTAO" : "PIX" },
    });
    for (const [pi, p] of S.lastPaid.entries()) {
      const inv = await db.invoice.create({ data: { subscriptionId: sub.id, studentId: student.id, amountCents: 15000, dueDate: d(p), reference: ref(d(p)), status: "PAID", paidAt: d(p), method: sub.paymentMethod } });
      const by = team[(si + pi) % 3];
      await db.payment.create({ data: { invoiceId: inv.id, amountCents: 15000, paidAt: d(p), method: sub.paymentMethod, recordedById: by.id } });
      await db.activityLog.create({ data: { actorId: by.id, action: "payment.create", entityType: "invoice", entityId: inv.id, studentId: student.id, description: `Pagamento de ${S.name} (R$ 150, ${sub.paymentMethod === "PIX" ? "Pix" : "Cartão"}) registrado por ${by.name}.`, createdAt: d(p) } });
    }
    await db.invoice.create({ data: { subscriptionId: sub.id, studentId: student.id, amountCents: 15000, dueDate: d(S.nextDue), reference: ref(d(S.nextDue)) } });

    await db.activityLog.create({ data: { actorId: author.id, action: "student.create", entityType: "student", entityId: student.id, studentId: student.id, description: `Aluno ${S.name} cadastrado por ${author.name}.`, createdAt: d(S.start) } });
    await db.activityLog.create({ data: { actorId: team[(si + 1) % 3].id, action: "workout.update", entityType: "workout", entityId: workouts[0].id, studentId: student.id, description: `Treino "${workouts[0].name}" de ${S.name} atualizado por ${team[(si + 1) % 3].name}.`, createdAt: daysAgo(si + 1, 10) } });

    await db.note.create({ data: { studentId: student.id, authorId: team[(si + 2) % 3].id, body: si === 3 ? "Faltou na última semana. Fazer contato para entender a rotina." : "Boa evolução técnica. Manter progressão de carga semanal.", createdAt: daysAgo(si + 2, 12) } });

    if (si < 3) {
      await db.message.create({ data: { studentId: student.id, senderId: student.userId, body: si === 0 ? "Posso trocar o supino reto por halteres hoje? A barra está ocupada." : "Senti o joelho no agachamento ontem, é normal?", createdAt: daysAgo(si + 1, 8), readByStudentAt: daysAgo(si + 1, 8), readByStaffAt: si === 0 ? daysAgo(si + 1, 9) : null } });
      if (si === 0) await db.message.create({ data: { studentId: student.id, senderId: tallison.id, body: "Pode sim! Mantenha 4×8-10 com halteres de 26 kg. Bom treino.", createdAt: daysAgo(1, 9), readByStaffAt: daysAgo(1, 9) } });
    }

    await db.notification.create({ data: { audience: "USER", userId: student.userId, type: "WORKOUT", title: "Seu novo treino foi disponibilizado.", body: workouts[0].name, link: `/aluno/treinos/${workouts[0].id}`, createdAt: d(S.start) } });
  }

  await db.notification.create({ data: { audience: "STAFF", type: "SESSION", title: "Maria concluiu o treino A.", body: "Peito + Tríceps · 100%", link: "/admin/alunos" } });
  await db.activityLog.create({ data: { actorId: admin.id, action: "plan.create", entityType: "plan", entityId: plan.id, description: `Plano "Consultoria mensal" criado por ${admin.name}.`, createdAt: d("2026-06-01") } });

  console.log("Seed concluído. Senha de todas as contas: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
