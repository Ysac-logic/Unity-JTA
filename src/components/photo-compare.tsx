"use client";

import { useMemo, useState } from "react";
import { Columns2, SplitSquareHorizontal } from "lucide-react";
import { Field, Select, cx } from "./ui";

type P = { id: string; angle: string; date: string; label: string };
const ANGLES: Record<string, string> = { FRONT: "Frente", BACK: "Costas", SIDE: "Lateral" };

export function PhotoCompare({ photos }: { photos: P[] }) {
  const angles = useMemo(() => Object.keys(ANGLES).filter((a) => photos.some((p) => p.angle === a)), [photos]);
  const [angle, setAngle] = useState(angles[0] ?? "FRONT");
  const list = photos.filter((p) => p.angle === angle).sort((a, b) => a.date.localeCompare(b.date));
  const [aId, setA] = useState<string | null>(null);
  const [bId, setB] = useState<string | null>(null);
  const [mode, setMode] = useState<"side" | "slider">("side");
  const [pos, setPos] = useState(50);

  const a = list.find((p) => p.id === aId) ?? list[0];
  const b = list.find((p) => p.id === bId) ?? list[list.length - 1];

  if (list.length < 2 && photos.length < 2) return <p className="text-sm text-muted">Envie pelo menos duas fotos do mesmo ângulo para comparar.</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Ângulo">
          <Select value={angle} onChange={(e) => { setAngle(e.target.value); setA(null); setB(null); }}>
            {angles.map((x) => <option key={x} value={x}>{ANGLES[x]}</option>)}
          </Select>
        </Field>
        <Field label="Antes">
          <Select value={a?.id ?? ""} onChange={(e) => setA(e.target.value)}>
            {list.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </Select>
        </Field>
        <Field label="Depois">
          <Select value={b?.id ?? ""} onChange={(e) => setB(e.target.value)}>
            {list.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </Select>
        </Field>
      </div>

      {list.length < 2 ? (
        <p className="text-sm text-muted">Há apenas uma foto de {ANGLES[angle].toLowerCase()}. Envie outra para comparar.</p>
      ) : (
        <>
          <div role="group" aria-label="Modo de comparação" className="inline-flex rounded-xl border border-line bg-surface-2 p-1">
            {([["side", "Lado a lado", Columns2], ["slider", "Deslizar", SplitSquareHorizontal]] as const).map(([k, l, Icon]) => (
              <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className={cx("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors cursor-pointer", mode === k ? "bg-surface-3 text-fg" : "text-muted hover:text-fg")}>
                <Icon aria-hidden className="size-4" /> {l}
              </button>
            ))}
          </div>

          {mode === "side" ? (
            <div className="grid grid-cols-2 gap-2">
              {[a, b].map((p, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border border-line bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/photos/${p.id}`} alt={`${ANGLES[p.angle]} em ${p.label}`} className="aspect-[3/4] w-full object-cover" />
                  <figcaption className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-semibold tnum">{p.label}</span>
                    <span className={cx("text-xs font-bold uppercase", i ? "text-brand-text" : "text-subtle")}>{i ? "Depois" : "Antes"}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-surface-2 sm:mx-auto sm:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/photos/${b.id}`} alt={`Depois: ${b.label}`} className="absolute inset-0 size-full object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/photos/${a.id}`} alt={`Antes: ${a.label}`} className="absolute inset-0 size-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
                <span aria-hidden className="absolute inset-y-0 w-0.5 bg-brand" style={{ left: `${pos}%` }} />
                <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white tnum">{a.label}</span>
                <span className="absolute right-2 top-2 rounded-md bg-brand px-2 py-1 text-xs font-bold tnum">{b.label}</span>
              </div>
              <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Posição da comparação" className="mt-3 w-full accent-[#a30f20] sm:mx-auto sm:block sm:max-w-md" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
