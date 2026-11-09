import { fShort } from "@/lib/dates";

type Point = { date: Date; value: number };

/** Gráfico de linha leve em SVG, com rótulos diretos e resumo acessível. */
export function LineChart({ points, unit, label, height = 160 }: { points: Point[]; unit: string; label: string; height?: number }) {
  if (points.length === 0) return <p className="py-6 text-center text-sm text-muted">Sem registros ainda.</p>;

  const W = 600;
  const H = height;
  const pad = { t: 26, r: 18, b: 26, l: 18 };
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i: number) => pad.l + (points.length === 1 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (points.length - 1));
  const y = (v: number) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(points.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const first = points[0].value;
  const last = points[points.length - 1].value;
  const delta = last - first;
  const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}`;
  const showEvery = Math.ceil(points.length / 6);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label}: de ${fmt(first)} ${unit} para ${fmt(last)} ${unit}`}>
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1={pad.l} x2={W - pad.r} y1={pad.t + t * (H - pad.t - pad.b)} y2={pad.t + t * (H - pad.t - pad.b)} stroke="#f5f2ed2e" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="#a30f20" fillOpacity="0.16" />
        <path d={path} fill="none" stroke="#e8394a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={i === points.length - 1 ? 5 : 3.5} fill={i === points.length - 1 ? "#a30f20" : "#101010"} stroke="#e8394a" strokeWidth="2">
              <title>{`${fShort(p.date)}: ${fmt(p.value)} ${unit}`}</title>
            </circle>
            {(i % showEvery === 0 || i === points.length - 1) && (
              <>
                <text x={x(i)} y={y(p.value) - 10} textAnchor="middle" fontSize="13" fontWeight="600" fill="#f5f2ed" className="tnum">
                  {fmt(p.value)}
                </text>
                <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="12" fill="#8f8f8f">
                  {fShort(p.date)}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
      {points.length > 1 && (
        <figcaption className="mt-1 text-xs text-muted">
          Variação no período:{" "}
          <span className="font-semibold text-fg tnum">
            {delta > 0 ? "+" : ""}
            {fmt(delta)} {unit}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
