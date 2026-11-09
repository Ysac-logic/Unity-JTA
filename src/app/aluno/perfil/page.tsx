import Link from "next/link";
import { LogOut, ChevronRight, History, MessageCircle, TrendingUp, Wallet } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { studentStats } from "@/lib/stats";
import { fDate } from "@/lib/dates";
import { GOALS } from "@/lib/labels";
import { logout } from "@/app/actions/auth";
import { updateOwnProfile } from "@/app/actions/team";
import { Avatar, Button, Card, Field, Input, SectionTitle } from "@/components/ui";
import { PasswordForm } from "@/components/password-form";

export const metadata = { title: "Perfil" };

export default async function StudentProfile() {
  const { user, student } = await requireStudent();
  const stats = await studentStats(student.id);
  const goal = student.goal === "OUTRO" && student.goalOther ? student.goalOther : GOALS[student.goal];

  return (
    <div className="space-y-8">
      <section className="flex items-center gap-4">
        <Avatar name={user.name} size={72} />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold uppercase leading-none">{user.name}</h1>
          <p className="mt-1 text-sm text-muted">Aluno LOW UNITY JTA desde {fDate(student.startDate)}</p>
        </div>
      </section>

      <Card className="grid grid-cols-3 divide-x divide-line text-center">
        {[
          ["Objetivo", goal],
          ["Treinos", String(stats.total)],
          ["Sequência", `${stats.streak} sem`],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-4">
            <p className="font-display text-lg font-bold leading-tight tnum">{v}</p>
            <p className="mt-1 text-xs text-subtle">{k}</p>
          </div>
        ))}
      </Card>

      <nav aria-label="Atalhos">
        <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          {[
            ["/aluno/historico", "Histórico de treinos", History],
            ["/aluno/evolucao", "Fotos e medidas", TrendingUp],
            ["/aluno/financeiro", "Situação da mensalidade", Wallet],
            ["/aluno/mensagens", "Falar com a equipe", MessageCircle],
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof History;
            return (
              <li key={href as string}>
                <Link href={href as string} className="flex h-14 items-center gap-3 px-4 hover:bg-surface-2">
                  <I aria-hidden className="size-5 text-muted" />
                  <span className="flex-1 font-medium">{label as string}</span>
                  <ChevronRight aria-hidden className="size-5 text-subtle" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section>
        <SectionTitle>Meus dados</SectionTitle>
        <Card className="p-4">
          <form action={updateOwnProfile} className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <Input name="name" defaultValue={user.name} autoComplete="name" required />
            </Field>
            <Field label="Telefone">
              <Input name="phone" type="tel" defaultValue={user.phone ?? ""} autoComplete="tel" />
            </Field>
            <Field label="E-mail" hint="Para alterar, fale com a equipe.">
              <Input value={user.email} readOnly className="text-muted" />
            </Field>
            <Field label="Data de nascimento">
              <Input value={fDate(student.birthDate)} readOnly className="text-muted" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="secondary">Salvar dados</Button>
            </div>
          </form>
        </Card>
      </section>

      <section>
        <SectionTitle>Senha</SectionTitle>
        <Card className="p-4">
          <PasswordForm />
        </Card>
      </section>

      <form action={logout}>
        <Button type="submit" variant="danger" className="w-full">
          <LogOut aria-hidden className="size-4" /> Sair da conta
        </Button>
      </form>
    </div>
  );
}
