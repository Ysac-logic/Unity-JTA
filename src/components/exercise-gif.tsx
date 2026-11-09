"use client";

import { useRef } from "react";
import { Dumbbell, Maximize2, X } from "lucide-react";
import { cx } from "./ui";

type Props = {
  name: string;
  gifUrl?: string | null;
  muscleGroup?: string | null;
  targetMuscle?: string | null;
  equipment?: string | null;
  instructions?: string | null;
  size?: number;
  className?: string;
};

/** Miniatura do GIF ao lado do exercício; ao tocar abre a prévia ampliada. */
export function ExerciseGif({ name, gifUrl, muscleGroup, targetMuscle, equipment, instructions, size = 56, className }: Props) {
  const dlg = useRef<HTMLDialogElement>(null);

  if (!gifUrl) {
    return (
      <span aria-hidden style={{ width: size, height: size }} className={cx("grid shrink-0 place-items-center rounded-lg bg-surface-3", className)}>
        <Dumbbell className="size-5 text-subtle" />
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dlg.current?.showModal();
        }}
        aria-label={`Ver execução de ${name}`}
        style={{ width: size, height: size }}
        className={cx("group relative shrink-0 overflow-hidden rounded-lg bg-white cursor-zoom-in", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gifUrl} alt="" loading="lazy" decoding="async" width={size} height={size} className="size-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/35">
          <Maximize2 className="size-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>

      <dialog
        ref={dlg}
        aria-label={name}
        onClick={(e) => {
          e.stopPropagation();
          if (e.target === dlg.current) dlg.current?.close();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="relative bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gifUrl} alt={`Demonstração de ${name}`} className="mx-auto aspect-square w-full max-w-md object-contain" />
            <button type="button" onClick={() => dlg.current?.close()} aria-label="Fechar prévia" className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-black/70 text-white hover:bg-black cursor-pointer" autoFocus>
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto p-5">
            <p className="eyebrow">{[muscleGroup, targetMuscle, equipment].filter(Boolean).join(" · ")}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight">{name}</h2>
            {instructions && (
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
                {instructions.split("\n").map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
