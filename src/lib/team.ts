// Contatos oficiais da equipe. Troque os números (formato internacional, só dígitos) e a chave Pix.
export const TEAM = [
  { name: "Tallison", specialty: "Hipertrofia e força", whatsapp: "5511900000001" },
  { name: "Adrian", specialty: "Performance e condicionamento", whatsapp: "5511900000002" },
  { name: "Joalison", specialty: "Emagrecimento e saúde", whatsapp: "5511900000003" },
] as const;

export const PIX_KEY = "pix@lowunityjta.com.br";
export const PIX_HOLDER = "LOW UNITY JTA";

export const wa = (phone: string, text?: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
