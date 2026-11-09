"use client";

import { useRef, useState, type ComponentProps } from "react";
import { cx } from "./ui";

type Props = ComponentProps<"div"> & { tiltLimit?: number; scale?: number; perspective?: number; glare?: boolean };

export function TiltCard({ tiltLimit = 10, scale = 1.05, perspective = 1200, glare = true, className, style, children, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, active: false });

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * 2 * tiltLimit, ry: (px - 0.5) * 2 * tiltLimit, s: scale, gx: px * 100, gy: py * 100, active: true });
  };
  const reset = () => setT({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, active: false });

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={cx("relative will-change-transform", className)}
      style={{
        transform: `perspective(${perspective}px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
        transition: t.active ? "transform 80ms linear" : "transform 500ms cubic-bezier(0.25,1,0.5,1)",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {children}
      {glare && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ opacity: t.active ? 1 : 0, background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgb(255 255 255 / 0.14), transparent 55%)` }}
        />
      )}
    </div>
  );
}
