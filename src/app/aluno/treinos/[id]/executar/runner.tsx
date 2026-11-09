"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Check, ChevronLeft, ChevronRight, Timer, Plus, Minus, Trophy, Loader2, Info } from "lucide-react";
import { finishSession } from "@/app/actions/sessions";
import { Button, ButtonLink, Card, Progress, cx } from "@/components/ui";
import { ExerciseGif } from "@/components/exercise-gif";

export type RunExercise = {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  loadKg: number | null;
  lastLoadKg: number | null;
  restSeconds: number;
  notes: string | null;
  instructions: string | null;
  gifUrl: string | null;
  targetMuscle: string | null;
  equipment: string | null;
};

type SetState = { reps: string; load: string; done: boolean };
type ExState = { done: boolean; sets: SetState[] };
type Saved = { startedAt: string; idx: number; state: ExState[] };
type Summary = { id: string; durationSec: number; done: number; total: number; pct: number; finishedAt: Date };

const firstInt = (s: string) => {
  const m = s.match(/\d+/);
  return m ? m[0] : "";
};
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (sec: number) => (sec >= 3600 ? `${Math.floor(sec / 3600)}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}` : `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`);

export function WorkoutRunner({ workoutId, workoutName, label, exercises }: { workoutId: string; workoutName: string; label: string | null; exercises: RunExercise[] }) {
  const key = `luj-run-${workoutId}`;
  const router = useRouter();
  const initial = useMemo<ExState[]>(
    () =>
      exercises.map((e) => ({
        done: false,
        sets: Array.from({ length: e.sets }, () => ({ reps: firstInt(e.reps), load: String(e.lastLoadKg ?? e.loadKg ?? ""), done: false })),
      })),
    [exercises],
  );

  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<ExState[]>(initial);
  const [now, setNow] = useState(() => Date.now());
  const [rest, setRest] = useState<{ endsAt: number; total: number } | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [pending, start] = useTransition();
  const restored = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        if (s.state?.length === exercises.length && Date.now() - new Date(s.startedAt).getTime() < 6 * 3600_000) {
          setStartedAt(s.startedAt);
          setIdx(Math.min(s.idx, exercises.length - 1));
          setState(s.state);
        }
      }
    } catch {}
    restored.current = true;
  }, [key, exercises.length]);

  useEffect(() => {
    if (!restored.current || summary) return;
    try {
      localStorage.setItem(key, JSON.stringify({ startedAt, idx, state } satisfies Saved));
    } catch {}
  }, [key, startedAt, idx, state, summary]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const restLeft = rest ? Math.max(0, Math.ceil((rest.endsAt - now) / 1000)) : 0;
  useEffect(() => {
    if (rest && restLeft === 0) {
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {}
      setRest(null);
    }
  }, [rest, restLeft]);

  const ex = exercises[idx];
  const es = state[idx];
  const elapsed = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const doneCount = state.filter((s) => s.done || s.sets.some((x) => x.done)).length;

  const patchSet = useCallback((si: number, patch: Partial<SetState>) => {
    setState((prev) => prev.map((e, i) => (i !== idx ? e : { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, ...patch } : s)) })));
  }, [idx]);

  const toggleSet = (si: number) => {
    const willBeDone = !es.sets[si].done;
    patchSet(si, { done: willBeDone });
    const isLast = es.sets.every((s, j) => (j === si ? willBeDone : s.done));
    if (willBeDone && ex.restSeconds > 0 && !isLast) setRest({ endsAt: Date.now() + ex.restSeconds * 1000, total: ex.restSeconds });
  };

  const step = (si: number, delta: number) => {
    const v = parseFloat(es.sets[si].load.replace(",", ".")) || 0;
    patchSet(si, { load: String(Math.max(0, Math.round((v + delta) * 2) / 2)) });
  };

  const completeExercise = () => {
    setState((prev) => prev.map((e, i) => (i !== idx ? e : { done: true, sets: e.sets.map((s) => ({ ...s, done: true })) })));
    setRest(null);
    if (idx < exercises.length - 1) setIdx(idx + 1);
  };

  const finish = () => {
    setError(null);
    const finishedAt = new Date();
    start(async () => {
      try {
        const num = (s: string) => {
          const n = parseFloat(s.replace(",", "."));
          return Number.isFinite(n) ? n : null;
        };
        const res = await finishSession({
          workoutId,
          startedAt,
          finishedAt: finishedAt.toISOString(),
          exercises: exercises.map((e, i) => ({
            exerciseId: e.exerciseId,
            name: e.name,
            done: state[i].done,
            sets: state[i].sets.map((s) => ({ reps: num(s.reps) == null ? null : Math.round(num(s.reps)!), loadKg: num(s.load), done: s.done })),
          })),
        });
        try {
          localStorage.removeItem(key);
        } catch {}
        const total = exercises.length;
        setSummary({ id: res.id, durationSec: Math.floor((finishedAt.getTime() - new Date(startedAt).getTime()) / 1000), done: doneCount, total, pct: Math.round((doneCount / total) * 100), finishedAt });
      } catch {
        setError("Não foi possível salvar. Verifique a conexão e tente novamente.");
      }
    });
  };

  if (summary) return <Done summary={summary} workoutName={workoutName} />;

  const allDone = state.every((s) => s.done);

  return (
    <div className="pb-40">
      <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setConfirmExit(true)} className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg cursor-pointer" aria-label="Sair do treino">
            <X className="size-5" />
          </button>
          <div className="min-w-0 text-center">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-subtle">{label ? `Treino ${label} · ` : ""}{workoutName}</p>
            <p className="font-display text-xl font-bold tnum" aria-label={`Tempo de treino ${clock(elapsed)}`}>{clock(elapsed)}</p>
          </div>
          <p className="w-11 text-right font-display text-lg font-bold tnum">
            {idx + 1}<span className="text-subtle">/{exercises.length}</span>
          </p>
        </div>
        <div className="mt-3">
          <Progress value={(doneCount / exercises.length) * 100} label="Progresso do treino" />
        </div>
      </div>

      <nav aria-label="Exercícios do treino" className="mb-5">
        <ol className="flex flex-wrap gap-1.5">
          {exercises.map((e, i) => {
            const s = state[i];
            const partial = !s.done && s.sets.some((x) => x.done);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-current={i === idx ? "step" : undefined}
                  aria-label={`${i + 1}. ${e.name}${s.done ? ", concluído" : partial ? ", em andamento" : ""}`}
                  className={cx(
                    "grid size-9 place-items-center rounded-lg border text-sm font-bold tnum transition-colors cursor-pointer",
                    i === idx ? "border-fg bg-fg text-bg" : s.done ? "border-brand bg-brand text-white" : partial ? "border-brand/60 text-brand-text" : "border-line text-muted hover:border-line-strong",
                  )}
                >
                  {s.done ? <Check aria-hidden className="size-4" /> : i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section aria-live="polite">
        <div className="flex items-start gap-4">
          <ExerciseGif key={ex.exerciseId} name={ex.name} gifUrl={ex.gifUrl} muscleGroup={ex.muscleGroup} targetMuscle={ex.targetMuscle} equipment={ex.equipment} instructions={ex.instructions} size={88} className="rounded-xl" />
          <div className="min-w-0">
            <p className="eyebrow">{[ex.muscleGroup, ex.equipment].filter(Boolean).join(" · ")}</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold uppercase leading-[0.95] text-balance sm:text-4xl">{ex.name}</h1>
            {ex.gifUrl && <p className="mt-1.5 text-xs text-subtle">Toque na imagem para ampliar</p>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Metric label="Séries × reps" value={`${ex.sets} × ${ex.reps}`} />
          <Metric label="Carga sugerida" value={ex.loadKg != null ? `${ex.loadKg} kg` : "Livre"} />
          <Metric label="Descanso" value={`${ex.restSeconds}s`} />
        </div>
        {ex.lastLoadKg != null && <p className="mt-2 text-sm text-muted tnum">Na última vez você usou {ex.lastLoadKg} kg.</p>}
        {(ex.notes || ex.instructions) && (
          <details className="mt-4 rounded-xl border border-line bg-surface p-3 text-sm">
            <summary className="flex cursor-pointer items-center gap-2 font-semibold">
              <Info aria-hidden className="size-4 text-brand-text" /> Orientações
            </summary>
            {ex.notes && <p className="mt-2 whitespace-pre-line">{ex.notes}</p>}
            {ex.instructions && <p className="mt-2 whitespace-pre-line text-muted">{ex.instructions}</p>}
          </details>
        )}
      </section>

      <section aria-label="Séries" className="mt-6 space-y-2">
        <div className="grid grid-cols-[2.5rem_1fr_5rem_3.25rem] gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-subtle">
          <span>Série</span>
          <span className="text-center">Carga (kg)</span>
          <span className="text-center">Reps</span>
          <span className="sr-only">Concluída</span>
        </div>
        {es.sets.map((s, si) => (
          <div key={si} className={cx("grid grid-cols-[2.5rem_1fr_5rem_3.25rem] items-center gap-2 rounded-xl border p-2 transition-colors", s.done ? "border-brand/50 bg-brand-soft" : "border-line bg-surface")}>
            <span className="text-center font-display text-xl font-bold tnum">{si + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => step(si, -2.5)} aria-label={`Diminuir carga da série ${si + 1}`} className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface-3 text-muted hover:text-fg cursor-pointer">
                <Minus className="size-4" />
              </button>
              <input
                value={s.load}
                onChange={(e) => patchSet(si, { load: e.target.value })}
                inputMode="decimal"
                aria-label={`Carga da série ${si + 1} em quilos`}
                className="h-11 w-full min-w-0 rounded-lg border border-line bg-surface-2 text-center text-lg font-semibold tnum focus:border-brand-text focus:outline-none"
              />
              <button type="button" onClick={() => step(si, 2.5)} aria-label={`Aumentar carga da série ${si + 1}`} className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface-3 text-muted hover:text-fg cursor-pointer">
                <Plus className="size-4" />
              </button>
            </div>
            <input
              value={s.reps}
              onChange={(e) => patchSet(si, { reps: e.target.value })}
              inputMode="numeric"
              aria-label={`Repetições da série ${si + 1}`}
              className="h-11 w-full rounded-lg border border-line bg-surface-2 text-center text-lg font-semibold tnum focus:border-brand-text focus:outline-none"
            />
            <button
              type="button"
              onClick={() => toggleSet(si)}
              aria-pressed={s.done}
              aria-label={`Série ${si + 1} ${s.done ? "concluída" : "marcar como concluída"}`}
              className={cx("grid size-12 place-items-center rounded-xl border-2 transition-colors cursor-pointer", s.done ? "border-brand bg-brand text-white" : "border-line-strong text-subtle hover:border-fg hover:text-fg")}
            >
              <Check className="size-6" strokeWidth={3} />
            </button>
          </div>
        ))}
      </section>

      {error && <p role="alert" className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-text">{error}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Button variant="secondary" size="lg" className="w-14 shrink-0 px-0" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Exercício anterior">
            <ChevronLeft className="size-6" />
          </Button>
          {idx === exercises.length - 1 || allDone ? (
            <Button size="lg" className="flex-1" onClick={es.done ? finish : () => { completeExercise(); }} disabled={pending}>
              {pending && <Loader2 aria-hidden className="size-5 animate-spin" />}
              {es.done ? "Finalizar treino" : "Concluir exercício"}
            </Button>
          ) : (
            <Button size="lg" className="flex-1" onClick={completeExercise}>
              {es.done ? "Próximo exercício" : "Concluir exercício"}
            </Button>
          )}
          <Button variant="secondary" size="lg" className="w-14 shrink-0 px-0" onClick={() => setIdx(Math.min(exercises.length - 1, idx + 1))} disabled={idx === exercises.length - 1} aria-label="Próximo exercício">
            <ChevronRight className="size-6" />
          </Button>
        </div>
        {!(idx === exercises.length - 1 && es.done) && doneCount > 0 && (
          <div className="mx-auto mt-2 max-w-2xl text-center">
            <button type="button" onClick={finish} disabled={pending} className="h-9 text-sm font-semibold text-muted underline-offset-4 hover:text-fg hover:underline cursor-pointer">
              Encerrar treino agora
            </button>
          </div>
        )}
      </div>

      {rest && (
        <div role="dialog" aria-modal="false" aria-label="Descanso" className="fixed inset-x-0 bottom-0 z-40 border-t border-brand/50 bg-surface px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgb(0_0_0/0.7)]">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <p className="eyebrow flex items-center gap-2 text-brand-text"><Timer aria-hidden className="size-4" /> Descanso</p>
              <p className="text-sm text-muted">Próxima série em</p>
            </div>
            <p className="mt-1 text-center font-display text-7xl font-extrabold tnum" aria-live="off">{clock(restLeft)}</p>
            <div className="mt-3">
              <Progress value={(restLeft / rest.total) * 100} label="Tempo de descanso restante" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="lg" onClick={() => setRest((r) => (r ? { endsAt: r.endsAt + 15000, total: r.total + 15 } : r))}>+15s</Button>
              <Button size="lg" onClick={() => setRest(null)}>Pular descanso</Button>
            </div>
          </div>
        </div>
      )}

      {confirmExit && (
        <div role="alertdialog" aria-modal="true" aria-labelledby="exit-title" className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-4 sm:place-items-center">
          <Card className="w-full max-w-sm p-5">
            <h2 id="exit-title" className="font-display text-2xl font-bold uppercase">Sair do treino?</h2>
            <p className="mt-2 text-sm text-muted">Seu progresso fica salvo neste aparelho e você pode continuar depois.</p>
            <div className="mt-5 grid gap-2">
              <Button variant="secondary" onClick={() => setConfirmExit(false)} autoFocus>Continuar treinando</Button>
              <Button variant="danger" onClick={() => router.push(`/aluno/treinos/${workoutId}`)}>Sair</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-2 py-3">
      <p className="font-display text-xl font-bold leading-none tnum">{value}</p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">{label}</p>
    </div>
  );
}

function Done({ summary, workoutName }: { summary: Summary; workoutName: string }) {
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", o).format(summary.finishedAt);
  const m = Math.floor(summary.durationSec / 60);
  return (
    <div className="flex min-h-[70dvh] flex-col justify-center py-8 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand">
        <Trophy aria-hidden className="size-9 text-white" />
      </span>
      <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-none">Treino<br />concluído!</h1>
      <p className="mt-3 text-muted">{workoutName}</p>
      <dl className="mt-8 grid grid-cols-2 gap-3 text-left">
        {[
          ["Duração", `${m}min ${pad(summary.durationSec % 60)}s`],
          ["Exercícios", `${summary.done}/${summary.total}`],
          ["Conclusão", `${summary.pct}%`],
          ["Data", fmt({ day: "2-digit", month: "2-digit", year: "numeric" })],
          ["Horário", fmt({ hour: "2-digit", minute: "2-digit" })],
        ].map(([k, v]) => (
          <Card key={k} className="p-4 last:col-span-2">
            <dt className="text-[13px] text-muted">{k}</dt>
            <dd className="mt-1 font-display text-2xl font-bold tnum">{v}</dd>
          </Card>
        ))}
      </dl>
      <div className="mt-8 grid gap-2">
        <ButtonLink href="/aluno" size="lg">Voltar ao início</ButtonLink>
        <ButtonLink href={`/aluno/historico/${summary.id}`} variant="secondary" size="lg">Ver detalhes no histórico</ButtonLink>
      </div>
      <p className="mt-6 text-sm text-subtle">Registro salvo e visível para a equipe LOW UNITY JTA.</p>
      <Link href="/aluno/evolucao" className="mt-2 text-sm font-semibold text-brand-text hover:underline">Registrar evolução</Link>
    </div>
  );
}
