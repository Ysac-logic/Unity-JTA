export type PayStatus = "PAGO" | "PENDENTE" | "ATRASO" | "A_VENCER" | "CANCELADO";

export const PAY_STATUS: Record<PayStatus, string> = {
  PAGO: "Pago",
  PENDENTE: "Pendente",
  ATRASO: "Em atraso",
  A_VENCER: "A vencer",
  CANCELADO: "Cancelado",
};
