import { Camera, Ruler, Dumbbell, Trash2, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { loadProgress } from "@/lib/stats";
import { fDate, ymd } from "@/lib/dates";
import { ANGLES, MEASURES } from "@/lib/labels";
import { addMeasurement, deletePhoto } from "@/app/actions/evolution";
import { Button, Card, EmptyState, Field, Input, SectionTitle } from "./ui";
import { LineChart } from "./line-chart";
import { PhotoUpload } from "./photo-upload";
import { PhotoCompare } from "./photo-compare";
import { ConfirmSubmit } from "./confirm-submit";

export async function EvolutionView({ studentId, canUpload = true }: { studentId: string; canUpload?: boolean }) {
  const [photos, measures, loads] = await Promise.all([
    db.progressPhoto.findMany({ where: { studentId }, orderBy: { takenAt: "desc" } }),
    db.measurement.findMany({ where: { studentId }, orderBy: { date: "asc" } }),
    loadProgress(studentId),
  ]);
  const todayStr = ymd(new Date());

  const byDate = new Map<string, typeof photos>();
  for (const p of photos) {
    const k = ymd(p.takenAt);
    byDate.set(k, [...(byDate.get(k) ?? []), p]);
  }
  const compareData = photos.map((p) => ({ id: p.id, angle: p.angle, date: ymd(p.takenAt), label: fDate(p.takenAt) }));

  const series = MEASURES.map((m) => ({
    ...m,
    points: measures.filter((x) => x[m.key] != null).map((x) => ({ date: x.date, value: x[m.key] as number })),
  })).filter((s) => s.points.length > 0);

  const customRows = measures.flatMap((m) => {
    try {
      return (JSON.parse(m.custom ?? "[]") as { label: string; value: number; unit: string }[]).map((c) => ({ ...c, date: m.date }));
    } catch {
      return [];
    }
  });

  return (
    <div className="space-y-10">
      <section aria-labelledby="h-photos" id="fotos" className="scroll-mt-24">
        <SectionTitle id="h-photos">Fotos de evolução</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {canUpload && (
            <Card className="p-4">
              <p className="mb-3 font-semibold">Nova foto</p>
              <PhotoUpload studentId={studentId} defaultDate={todayStr} />
            </Card>
          )}
          <Card className="p-4">
            <p className="mb-3 font-semibold">Comparar períodos</p>
            {photos.length > 1 ? <PhotoCompare photos={compareData} /> : <p className="text-sm text-muted">Com duas fotos do mesmo ângulo você poderá comparar antes e depois.</p>}
          </Card>
        </div>

        <div className="mt-6 space-y-5">
          {photos.length === 0 && <EmptyState icon={Camera} title="Nenhuma foto ainda" description="Registre frente, costas e lateral a cada 30 dias, sempre com a mesma luz e posição." />}
          {[...byDate.entries()].map(([d, list]) => (
            <div key={d}>
              <p className="eyebrow mb-2 tnum">{fDate(list[0].takenAt)}</p>
              <ul className="grid grid-cols-3 gap-2">
                {list.map((p) => (
                  <li key={p.id} className="group relative overflow-hidden rounded-xl border border-line bg-surface-2">
                    <a href={`/api/photos/${p.id}?log=1`} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/photos/${p.id}`} alt={`${ANGLES[p.angle]} em ${fDate(p.takenAt)}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                    </a>
                    <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                      <span className="text-xs font-semibold">{ANGLES[p.angle]}</span>
                      <form action={deletePhoto.bind(null, p.id)}>
                        <ConfirmSubmit message="Excluir esta foto de evolução?" aria-label={`Excluir foto ${ANGLES[p.angle]} de ${fDate(p.takenAt)}`} className="grid size-8 place-items-center rounded-md text-subtle hover:bg-brand-soft hover:text-brand-text cursor-pointer">
                          <Trash2 className="size-4" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-measures" id="medidas" className="scroll-mt-24">
        <SectionTitle id="h-measures">Medidas</SectionTitle>
        <details className="group mb-4 rounded-[var(--radius-card)] border border-line bg-surface" open={measures.length === 0}>
          <summary className="flex h-14 cursor-pointer list-none items-center gap-2 px-4 font-semibold [&::-webkit-details-marker]:hidden">
            <Plus aria-hidden className="size-5 text-brand-text transition-transform group-open:rotate-45" /> Registrar medidas
          </summary>
          <form action={addMeasurement.bind(null, studentId)} className="space-y-4 border-t border-line p-4">
            <Field label="Data" className="max-w-48">
              <Input type="date" name="date" defaultValue={todayStr} max={todayStr} required />
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MEASURES.map((m) => (
                <Field key={m.key} label={`${m.label} (${m.unit})`}>
                  <Input name={m.key} inputMode="decimal" placeholder="—" />
                </Field>
              ))}
            </div>
            <fieldset className="grid grid-cols-[1fr_6rem_5rem] gap-3">
              <legend className="mb-1.5 text-sm font-medium">Medida personalizada (opcional)</legend>
              <Input name="customLabel" placeholder="Ex.: Antebraço" aria-label="Nome da medida personalizada" />
              <Input name="customValue" inputMode="decimal" placeholder="Valor" aria-label="Valor da medida personalizada" />
              <Input name="customUnit" defaultValue="cm" aria-label="Unidade" />
            </fieldset>
            <Button type="submit">Salvar medidas</Button>
          </form>
        </details>

        {series.length === 0 ? (
          <EmptyState icon={Ruler} title="Sem medidas registradas" description="Registre peso e circunferências para acompanhar a evolução em gráficos." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {series.map((s) => (
              <Card key={s.key} className="p-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="font-semibold">{s.label}</p>
                  <p className="font-display text-xl font-bold tnum">
                    {s.points[s.points.length - 1].value} <span className="text-sm text-muted">{s.unit}</span>
                  </p>
                </div>
                <LineChart points={s.points} unit={s.unit} label={s.label} height={140} />
              </Card>
            ))}
          </div>
        )}
        {customRows.length > 0 && (
          <Card className="mt-3 p-4">
            <p className="mb-2 font-semibold">Medidas personalizadas</p>
            <ul className="divide-y divide-line text-sm tnum">
              {customRows.map((c, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>{c.label}</span>
                  <span className="text-muted">{c.value} {c.unit} · {fDate(c.date)}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      <section aria-labelledby="h-loads" id="cargas" className="scroll-mt-24">
        <SectionTitle id="h-loads">Evolução de cargas</SectionTitle>
        {loads.length === 0 ? (
          <EmptyState icon={Dumbbell} title="Sem cargas registradas" description="As cargas registradas durante os treinos aparecem aqui." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {loads.slice(0, 8).map((l) => (
              <Card key={l.id} className="p-4">
                <p className="font-semibold">{l.name}</p>
                <p className="mb-2 text-sm text-muted tnum">{l.points.map((p) => p.value).slice(-5).join(" → ")} kg</p>
                <LineChart points={l.points} unit="kg" label={`Carga em ${l.name}`} height={130} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
