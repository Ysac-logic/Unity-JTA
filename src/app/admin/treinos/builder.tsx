"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { saveWorkout, type WorkoutItemInput } from "@/app/actions/workouts";
import { CATEGORIES } from "@/lib/exercisedb";
import { Button, Card, Field, Input, Select, Textarea, cx } from "@/components/ui";
import { ExerciseGif } from "@/components/exercise-gif";

export type BuilderExercise = { id: string; name: string; muscleGroup: string; gifUrl: string | null; targetMuscle: string | null; equipment: string | null };
type Item = WorkoutItemInput & { key: string };

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const PAGE = 40;
let seq = 0;
const k = () => `i${++seq}`;
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function WorkoutBuilder({
  students,
  exercises,
  initial,
}: {
  students: { id: string; name: string }[];
  exercises: BuilderExercise[];
  initial: { id?: string; studentId?: string; name?: string; label?: string | null; dayOfWeek?: number | null; notes?: string | null; items: WorkoutItemInput[] };
}) {
  const [state, action, pending] = useActionState(saveWorkout, undefined);
  const [items, setItems] = useState<Item[]>(() => initial.items.map((i) => ({ ...i, key: k() })));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [limit, setLimit] = useState(PAGE);
  const [flash, setFlash] = useState<string | null>(null);

  const byId = useMemo(() => Object.fromEntries(exercises.map((e) => [e.id, e])), [exercises]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of exercises) c[e.muscleGroup] = (c[e.muscleGroup] ?? 0) + 1;
    return c;
  }, [exercises]);
  const cats = [...CATEGORIES.filter((c) => counts[c]), ...Object.keys(counts).filter((c) => !(CATEGORIES as readonly string[]).includes(c))];
  const filtered = useMemo(() => {
    const t = norm(q.trim());
    return exercises.filter((e) => (!cat || e.muscleGroup === cat) && (!t || norm(`${e.name} ${e.targetMuscle ?? ""} ${e.equipment ?? ""}`).includes(t)));
  }, [exercises, q, cat]);

  const add = (e: BuilderExercise) => {
    setItems((p) => [...p, { key: k(), exerciseId: e.id, sets: 3, reps: "10", loadKg: null, restSeconds: 60, notes: null }]);
    setFlash(e.id);
    setTimeout(() => setFlash((f) => (f === e.id ? null : f)), 900);
  };
  const patch = (key: string, v: Partial<Item>) => setItems((p) => p.map((i) => (i.key === key ? { ...i, ...v } : i)));
  const move = (idx: number, d: number) =>
    setItems((p) => {
      const n = [...p];
      const j = idx + d;
      if (j < 0 || j >= n.length) return p;
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });

  const payload = JSON.stringify(items.map(({ key: _key, ...rest }) => rest));

  return (
    <form action={action} className="space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="items" value={payload} />

      <Card className="p-4 sm:p-6">
        <p className="eyebrow mb-4">1 · Aluno e identificação</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Aluno" required className="sm:col-span-2">
            <Select name="studentId" defaultValue={initial.studentId ?? ""} required disabled={!!initial.id}>
              <option value="" disabled>Selecione o aluno</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            {initial.id && <input type="hidden" name="studentId" value={initial.studentId} />}
          </Field>
          <Field label="Nome do treino" required className="sm:col-span-2"><Input name="name" defaultValue={initial.name ?? ""} placeholder="Ex.: Peito + Tríceps" required /></Field>
          <Field label="Divisão" hint="A, B, C…"><Input name="label" defaultValue={initial.label ?? ""} maxLength={3} /></Field>
          <Field label="Dia da semana">
            <Select name="dayOfWeek" defaultValue={initial.dayOfWeek == null ? "" : String(initial.dayOfWeek)}>
              <option value="">Sem dia fixo</option>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => <option key={d} value={d}>{DAYS[d]}</option>)}
            </Select>
          </Field>
          <Field label="Orientações gerais" className="sm:col-span-2"><Textarea name="notes" defaultValue={initial.notes ?? ""} className="min-h-12" rows={1} placeholder="Aquecimento, intensidade, cadência…" /></Field>
        </div>
      </Card>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <section aria-labelledby="h-lib" className="min-w-0 lg:sticky lg:top-6">
          <Card className="flex min-w-0 flex-col p-4 lg:max-h-[calc(100dvh-3rem)]">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <p id="h-lib" className="eyebrow">2 · Biblioteca · toque para adicionar</p>
              <span className="text-xs text-subtle tnum">{filtered.length}</span>
            </div>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Buscar exercício, músculo…" aria-label="Buscar exercício" className="pl-10" />
            </div>
            <div role="group" aria-label="Categorias" className="mt-3 flex flex-wrap gap-1.5">
              {[["", "Todos", exercises.length] as const, ...cats.map((c) => [c, c, counts[c]] as const)].map(([key, label, n]) => (
                <button
                  key={key || "all"}
                  type="button"
                  aria-pressed={cat === key}
                  onClick={() => { setCat(key); setLimit(PAGE); }}
                  className={cx("inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors cursor-pointer", cat === key ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-line-strong hover:text-fg")}
                >
                  {label} <span className={cx("text-xs tnum", cat === key ? "text-white/75" : "text-subtle")}>{n}</span>
                </button>
              ))}
            </div>
            <ul className="mt-3 -mx-1 min-h-0 min-w-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto px-1 max-lg:max-h-[26rem]">
              {filtered.slice(0, limit).map((e) => {
                const count = items.filter((i) => i.exerciseId === e.id).length;
                return (
                  <li key={e.id} className={cx("flex items-center gap-3 rounded-xl p-1.5 transition-colors", flash === e.id ? "bg-ok-soft" : "hover:bg-surface-2")}>
                    <ExerciseGif name={e.name} gifUrl={e.gifUrl} muscleGroup={e.muscleGroup} targetMuscle={e.targetMuscle} equipment={e.equipment} size={52} />
                    <button type="button" onClick={() => add(e)} className="flex min-h-12 min-w-0 flex-1 items-center gap-2 text-left cursor-pointer" aria-label={`Adicionar ${e.name}`}>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 break-words text-sm font-semibold leading-snug">{e.name}</span>
                        <span className="block truncate text-xs text-subtle">{[e.targetMuscle, e.equipment].filter(Boolean).join(" · ")}</span>
                      </span>
                      {count > 0 && <span className="rounded bg-brand-soft px-1.5 text-xs font-bold text-brand-text tnum">{count}×</span>}
                      <span className={cx("grid size-9 shrink-0 place-items-center rounded-lg", flash === e.id ? "bg-ok text-bg" : "bg-surface-3 text-brand-text")}>
                        {flash === e.id ? <Check aria-hidden className="size-4" /> : <Plus aria-hidden className="size-4" />}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="p-3 text-sm text-muted">Nenhum exercício encontrado.</li>}
              {filtered.length > limit && (
                <li className="pt-2">
                  <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => setLimit((l) => l + PAGE)}>
                    Mostrar mais ({filtered.length - limit})
                  </Button>
                </li>
              )}
            </ul>
          </Card>
        </section>

        <section aria-labelledby="h-items">
          <p id="h-items" className="eyebrow mb-3">3 · Treino ({items.length} exercícios) · ajuste séries, repetições e carga</p>
          <ol className="space-y-3" aria-live="polite">
            {items.map((it, idx) => {
              const ex = byId[it.exerciseId];
              return (
                <li key={it.key}>
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-3 font-display text-sm font-bold tnum">{idx + 1}</span>
                      <ExerciseGif name={ex?.name ?? ""} gifUrl={ex?.gifUrl} muscleGroup={ex?.muscleGroup} targetMuscle={ex?.targetMuscle} equipment={ex?.equipment} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug">{ex?.name ?? "Exercício removido"}</p>
                        <p className="text-sm text-muted">{[ex?.muscleGroup, ex?.equipment].filter(Boolean).join(" · ")}</p>
                      </div>
                      <div className="flex shrink-0">
                        <Button type="button" variant="ghost" size="sm" className="px-2" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Mover para cima"><ArrowUp className="size-4" /></Button>
                        <Button type="button" variant="ghost" size="sm" className="px-2" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} aria-label="Mover para baixo"><ArrowDown className="size-4" /></Button>
                        <Button type="button" variant="ghost" size="sm" className="px-2" onClick={() => setItems((p) => p.filter((x) => x.key !== it.key))} aria-label={`Remover ${ex?.name}`}><Trash2 className="size-4" /></Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Field label="Séries"><Input type="number" min={1} max={20} inputMode="numeric" value={it.sets} onChange={(e) => patch(it.key, { sets: Number(e.target.value) })} /></Field>
                      <Field label="Repetições" hint="Ex.: 10 ou 8-12"><Input value={it.reps} onChange={(e) => patch(it.key, { reps: e.target.value })} /></Field>
                      <Field label="Carga (kg)"><Input type="number" min={0} step={0.5} inputMode="decimal" value={it.loadKg ?? ""} onChange={(e) => patch(it.key, { loadKg: e.target.value === "" ? null : e.target.valueAsNumber })} placeholder="Livre" /></Field>
                      <Field label="Descanso (s)"><Input type="number" min={0} step={15} inputMode="numeric" value={it.restSeconds} onChange={(e) => patch(it.key, { restSeconds: Number(e.target.value) })} /></Field>
                      <Field label="Observações" className="col-span-2 sm:col-span-4"><Input value={it.notes ?? ""} onChange={(e) => patch(it.key, { notes: e.target.value || null })} placeholder="Cadência, amplitude, técnica…" /></Field>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
          {items.length === 0 && <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">Toque nos exercícios da biblioteca para montar o treino.</p>}
        </section>
      </div>

      {state?.error && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-text">{state.error}</p>}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 aria-hidden className="size-5 animate-spin" />}
          {initial.id ? "Salvar alterações" : `Salvar e publicar${items.length ? ` (${items.length})` : ""}`}
        </Button>
      </div>
    </form>
  );
}
