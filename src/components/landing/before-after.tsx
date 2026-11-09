"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useState } from "react";
import { Photo } from "./photo";

export function BeforeAfter({ before, after, caption }: { before: string; after: string; caption: string }) {
  const [pos, setPos] = useState(50);
  const tag = "absolute top-4 bg-lu-black/80 px-3 py-1 font-sans text-xs font-bold uppercase tracking-[0.24em] text-lu-ice";
  return (
    <figure>
      <div className="relative aspect-[4/5] select-none overflow-hidden bg-lu-black sm:aspect-[16/9]">
        <Photo src={after} alt="Depois" label="Foto depois" sizes="(min-width:1024px) 80vw, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="absolute inset-0 bg-lu-coal">
            <Photo src={before} alt="Antes" label="Foto antes" sizes="(min-width:1024px) 80vw, 100vw" />
          </div>
        </div>
        <span className={`${tag} left-4`}>Antes</span>
        <span className={`${tag} right-4 !bg-lu-red`}>Depois</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-lu-ice" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lu-red text-lu-ice shadow-[0_0_0_6px_rgb(245_244_239/0.15)]">
            <ChevronsLeftRight className="size-5" />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Arraste para comparar antes e depois"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 font-mono text-xs uppercase tracking-wider text-lu-ink">{caption}</figcaption>
    </figure>
  );
}
