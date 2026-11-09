import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { brl, ROLES } from "@/lib/labels";
import { savePlan, toggleUser, updateOwnProfile } from "@/app/actions/team";
import { Avatar, Button, Card, Field, Input, PageHeader, SectionTitle, Tag, btn } from "@/components/ui";
import { PasswordForm } from "@/components/password-form";
import { StaffForm } from "./staff-form";

export const metadata = { title: "Configurações" };

export default async function Settings() {
  const me = await requireStaff();
  const isAdmin = me.role === "ADMIN";
  const [team, plans] = await Promise.all([
    db.user.findMany({ where: { role: { in: ["ADMIN", "TRAINER"] } }, orderBy: [{ role: "asc" }, { name: "asc" }] }),
    db.plan.findMany({ orderBy: { priceCents: "asc" }, include: { _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } } } }),
  ]);

  return (
    <>
      <PageHeader eyebrow="LOW UNITY JTA" title="Configurações" />
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="h-team">
          <SectionTitle id="h-team">Equipe</SectionTitle>
          <p className="mb-3 text-sm text-muted">Todos os treinadores têm as mesmas permissões e acessam todos os alunos.</p>
          <Card className="divide-y divide-line">
            {team.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-4">
                <Avatar name={u.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{u.name} {u.id === me.id && <span className="text-sm font-normal text-subtle">(você)</span>}</p>
                  <p className="truncate text-sm text-muted">{u.email}</p>
                </div>
                <Tag tone={u.role === "ADMIN" ? "brand" : "default"}>{ROLES[u.role]}</Tag>
                {!u.active && <Tag>Inativo</Tag>}
                {isAdmin && u.id !== me.id && (
                  <form action={toggleUser.bind(null, u.id)}>
                    <button type="submit" className={btn("ghost", "sm")}>{u.active ? "Desativar" : "Ativar"}</button>
                  </form>
                )}
              </div>
            ))}
          </Card>
          {isAdmin && (
            <details className="mt-3 rounded-[var(--radius-card)] border border-line bg-surface">
              <summary className="flex h-14 cursor-pointer items-center px-4 font-semibold">Adicionar profissional</summary>
              <div className="border-t border-line p-4"><StaffForm /></div>
            </details>
          )}
        </section>

        <section aria-labelledby="h-plans">
          <SectionTitle id="h-plans">Planos</SectionTitle>
          <Card className="divide-y divide-line">
            {plans.map((p) => (
              <details key={p.id} className="group">
                <summary className="flex cursor-pointer items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted tnum">{brl(p.priceCents)} / {p.intervalMonths === 1 ? "mês" : `${p.intervalMonths} meses`} · {p._count.subscriptions} alunos</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-text">Editar</span>
                </summary>
                <PlanForm plan={p} />
              </details>
            ))}
          </Card>
          <details className="mt-3 rounded-[var(--radius-card)] border border-line bg-surface">
            <summary className="flex h-14 cursor-pointer items-center px-4 font-semibold">Novo plano</summary>
            <PlanForm />
          </details>
          <p className="mt-3 text-xs text-subtle">Estrutura pronta para pagamentos online, assinaturas e cobrança automática em versões futuras.</p>
        </section>

        <section aria-labelledby="h-me">
          <SectionTitle id="h-me">Meu perfil</SectionTitle>
          <Card className="p-4">
            <form action={updateOwnProfile} className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome"><Input name="name" defaultValue={me.name} required /></Field>
              <Field label="Telefone"><Input name="phone" type="tel" defaultValue={me.phone ?? ""} /></Field>
              <div className="sm:col-span-2"><Button type="submit" variant="secondary">Salvar</Button></div>
            </form>
          </Card>
        </section>

        <section aria-labelledby="h-pwd">
          <SectionTitle id="h-pwd">Senha</SectionTitle>
          <Card className="p-4"><PasswordForm /></Card>
        </section>
      </div>
    </>
  );
}

function PlanForm({ plan }: { plan?: { id: string; name: string; priceCents: number; intervalMonths: number; description: string | null } }) {
  return (
    <form action={savePlan} className="grid gap-3 border-t border-line p-4 sm:grid-cols-3">
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <Field label="Nome"><Input name="name" defaultValue={plan?.name} required /></Field>
      <Field label="Valor (R$)"><Input name="price" inputMode="decimal" defaultValue={plan ? String(plan.priceCents / 100) : ""} required /></Field>
      <Field label="Ciclo (meses)"><Input name="intervalMonths" type="number" min={1} defaultValue={plan?.intervalMonths ?? 1} /></Field>
      <Field label="Descrição" className="sm:col-span-3"><Input name="description" defaultValue={plan?.description ?? ""} /></Field>
      <div><Button type="submit" size="sm">Salvar plano</Button></div>
    </form>
  );
}
