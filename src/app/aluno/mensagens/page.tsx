import { requireStudent } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { TeamContacts } from "@/components/team-contacts";

export const metadata = { title: "Mensagens" };

export default async function StudentMessages() {
  const { user } = await requireStudent();
  return (
    <>
      <PageHeader eyebrow="Fale com a equipe" title="Entrar em contato" description="Escolha um dos personais da LOW UNITY JTA. A conversa abre no WhatsApp." />
      <TeamContacts text={`Olá {nome}! Aqui é ${user.name}, aluno da LOW UNITY JTA.`} />
    </>
  );
}
