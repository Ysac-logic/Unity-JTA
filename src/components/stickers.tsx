import type { CSSProperties } from "react";

type P = { className?: string; style?: CSSProperties };

/** Fita azul inflada: tubo plano com contorno preto, ancora a composição atrás dos títulos. */
export function Ribbon({ className, style, flip }: P & { flip?: boolean }) {
  const d = flip
    ? "M-40 90 C 180 -10, 360 250, 620 150 S 1000 -30, 1260 120"
    : "M-40 150 C 200 270, 380 -10, 640 110 S 1010 290, 1260 90";
  return (
    <svg aria-hidden viewBox="0 0 1200 300" preserveAspectRatio="none" className={className} style={style}>
      <path d={d} fill="none" stroke="#fff" strokeWidth="78" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#e10600" strokeWidth="74" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ff6b5e" strokeWidth="14" strokeLinecap="round" strokeDasharray="220 40" transform="translate(0 -18)" opacity="0.9" />
    </svg>
  );
}

export function Coin({ className, style, label = "L" }: P & { label?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      <circle cx="54" cy="56" r="42" fill="#6e0300" />
      <circle cx="48" cy="50" r="42" fill="#fff" stroke="#000" strokeWidth="2" />
      <circle cx="48" cy="50" r="30" fill="none" stroke="#e10600" strokeWidth="3" />
      <text x="48" y="64" textAnchor="middle" fontSize={label.length > 1 ? 28 : 44} fill="#000" style={{ fontFamily: "var(--font-display)" }}>{label}</text>
    </svg>
  );
}

export function CheckSticker({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      <rect x="10" y="12" width="82" height="82" rx="22" fill="#6e0300" />
      <rect x="6" y="6" width="82" height="82" rx="22" fill="#fff" stroke="#000" strokeWidth="2" />
      <path d="M26 48 L42 64 L70 30" fill="none" stroke="#e10600" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BoltSticker({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      <path d="M62 14 L22 58 H46 L38 92 L82 44 H56 Z" fill="#6e0300" transform="translate(5 5)" />
      <path d="M62 14 L22 58 H46 L38 92 L82 44 H56 Z" fill="#e10600" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function DumbbellSticker({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 120 80" className={className} style={style}>
      <g transform="translate(5 5)" fill="#6e0300">
        <rect x="4" y="22" width="18" height="36" rx="6" />
        <rect x="24" y="12" width="16" height="56" rx="6" />
        <rect x="40" y="34" width="40" height="12" />
        <rect x="80" y="12" width="16" height="56" rx="6" />
        <rect x="98" y="22" width="18" height="36" rx="6" />
      </g>
      <g fill="#e10600" stroke="#fff" strokeWidth="3">
        <rect x="4" y="22" width="18" height="36" rx="6" />
        <rect x="24" y="12" width="16" height="56" rx="6" />
        <rect x="40" y="34" width="40" height="12" fill="#fff" />
        <rect x="80" y="12" width="16" height="56" rx="6" />
        <rect x="98" y="22" width="18" height="36" rx="6" />
      </g>
    </svg>
  );
}

export function StarSticker({ className, style }: P) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} style={style}>
      <path d="M50 6 L61 36 L94 38 L68 58 L77 90 L50 72 L23 90 L32 58 L6 38 L39 36 Z" fill="#6e0300" transform="translate(5 5)" />
      <path d="M50 6 L61 36 L94 38 L68 58 L77 90 L50 72 L23 90 L32 58 L6 38 L39 36 Z" fill="#fff" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
