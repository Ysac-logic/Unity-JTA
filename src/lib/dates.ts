export const TZ = "America/Sao_Paulo";
const DAY = 86_400_000;

/** Datas sem horário são armazenadas às 12:00 UTC para evitar deslocamento de fuso. */
export function dateOnly(input: string | Date) {
  const s = typeof input === "string" ? input.slice(0, 10) : ymd(input);
  return new Date(`${s}T12:00:00.000Z`);
}

export function ymd(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export const today = () => dateOnly(ymd(new Date()));

export function addMonths(d: Date, n: number) {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last), 12));
}

export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
export const diffDays = (a: Date, b: Date) => Math.round((dateOnly(a).getTime() - dateOnly(b).getTime()) / DAY);

export function weekStart(d: Date) {
  const x = dateOnly(d);
  return addDays(x, -((x.getUTCDay() + 6) % 7));
}

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...o });
export const fDate = (d?: Date | null) => (d ? fmt({ day: "2-digit", month: "2-digit", year: "numeric" }).format(d) : "—");
export const fShort = (d?: Date | null) => (d ? fmt({ day: "2-digit", month: "2-digit" }).format(d) : "—");
export const fTime = (d?: Date | null) => (d ? fmt({ hour: "2-digit", minute: "2-digit" }).format(d) : "—");
export const fDateTime = (d?: Date | null) => (d ? `${fDate(d)} · ${fTime(d)}` : "—");
export const fMonthYear = (d: Date) => fmt({ month: "long", year: "numeric" }).format(d).replace(" de ", "/").toUpperCase();
export const fWeekdayLong = (d: Date) => fmt({ weekday: "long", day: "numeric", month: "long" }).format(d);

export function fRelative(d: Date) {
  const days = diffDays(new Date(), d);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 0) return `em ${-days} dia${days === -1 ? "" : "s"}`;
  return `há ${days} dias`;
}

export function fDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}h ${String(m).padStart(2, "0")}min`;
  return `${m}min ${String(s).padStart(2, "0")}s`;
}

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const weekdayIndex = () => today().getUTCDay();
