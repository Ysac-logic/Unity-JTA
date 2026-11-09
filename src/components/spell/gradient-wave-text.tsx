import type { ReactNode } from "react";

export function GradientWaveText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`lu-wave-text ${className ?? ""}`}>{children}</span>;
}
