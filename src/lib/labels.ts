export const GOALS: Record<string, string> = {
  HIPERTROFIA: "Hipertrofia",
  EMAGRECIMENTO: "Emagrecimento",
  FORCA: "Ganho de força",
  CONDICIONAMENTO: "Condicionamento",
  PERFORMANCE: "Performance",
  SAUDE: "Saúde e qualidade de vida",
  OUTRO: "Outro",
};

export const METHODS: Record<string, string> = {
  PIX: "Pix",
  CARTAO: "Cartão",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferência",
  DINHEIRO: "Dinheiro",
  OUTRO: "Outro",
};

export const ROLES: Record<string, string> = { ADMIN: "Administrador", TRAINER: "Personal trainer", STUDENT: "Aluno" };

export const ANGLES: Record<string, string> = { FRONT: "Frente", BACK: "Costas", SIDE: "Lateral" };

export const MUSCLE_GROUPS = [
  "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Antebraço", "Abdômen",
  "Quadríceps", "Posterior", "Glúteos", "Panturrilha", "Corpo inteiro", "Cardio", "Mobilidade",
];

export const MEASURES = [
  { key: "weightKg", label: "Peso", unit: "kg" },
  { key: "waistCm", label: "Cintura", unit: "cm" },
  { key: "abdomenCm", label: "Abdômen", unit: "cm" },
  { key: "hipCm", label: "Quadril", unit: "cm" },
  { key: "armCm", label: "Braço", unit: "cm" },
  { key: "thighCm", label: "Coxa", unit: "cm" },
  { key: "calfCm", label: "Panturrilha", unit: "cm" },
] as const;

export type MeasureKey = (typeof MEASURES)[number]["key"];

export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const kg = (v?: number | null) => (v == null ? "—" : `${Number.isInteger(v) ? v : v.toFixed(1)} kg`);

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export const toCents = (v: FormDataEntryValue | null) => Math.round(parseFloat(String(v ?? "0").replace(",", ".")) * 100) || 0;
export const toNum = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};
export const str = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s || null;
};
