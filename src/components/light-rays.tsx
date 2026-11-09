import type { CSSProperties } from "react";
import { cx } from "./ui";

type Props = { backgroundColor?: string; color?: string; count?: number; className?: string; style?: CSSProperties };

/** Feixes de luz animados vindos do topo. Determinístico (SSR) e respeita reduced-motion via globals.css. */
export default function Rays({ backgroundColor = "transparent", color = "rgb(225 6 0 / 0.55)", count = 9, className, style }: Props) {
  const rays = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const jitter = ((i * 37) % 11) / 11;
    return {
      left: `${8 + t * 84}%`,
      width: `${6 + jitter * 10}%`,
      rotate: `${(t - 0.5) * 50}deg`,
      delay: `${-jitter * 8}s`,
      duration: `${7 + jitter * 6}s`,
      opacity: 0.35 + jitter * 0.5,
    };
  });

  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ background: backgroundColor, ...style }}>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_90%_75%_at_50%_0%,black_25%,transparent_80%)]">
        {rays.map((r, i) => (
          <span
            key={i}
            className="luj-ray"
            style={{
              left: r.left,
              width: r.width,
              background: `linear-gradient(to bottom, ${color}, transparent 85%)`,
              animationDelay: r.delay,
              animationDuration: r.duration,
              ["--r" as string]: r.rotate,
              ["--o" as string]: r.opacity,
            }}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: color }} />
    </div>
  );
}
