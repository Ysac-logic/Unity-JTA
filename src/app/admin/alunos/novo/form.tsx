"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { createStudent } from "@/app/actions/students";
import { GOALS, METHODS } from "@/lib/labels";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";

export function NewStudentForm({ plans, start, firstDue }: { plans: { id: string; name: string; price: number }[]; start: string; firstDue: string }) {
  const [state, action, pending] = useActionState(createStudent, undefined);
  const [goal, setGoal] = useState("HIPERTROFIA");
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const price = plans.find((p) => p.id === planId)?.price;

  return (
    <form action={action} className="space-y-6">
      <Card className="p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Dados pessoais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" required><Input name="name" autoComplete="off" required /></Field>
          <Field label="E-mail (login)" required><Input name="email" type="email" autoComplete="off" required /></Field>
          <Field label="Telefone"><Input name="phone" type="tel" /></Field>
          <Field label="Data de nascimento"><Input name="birthDate" type="date" /></Field>
          <Field label="Senha inicial" required hint="O aluno pode alterar depois no perfil."><Input name="password" type="text" minLength={6} required autoComplete="off" /></Field>
          <Field label="Data de início"><Input name="startDate" type="date" defaultValue={start} /></Field>
          <Field label="Objetivo" required>
            <Select name="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
              {Object.entries(GOALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          {goal === "OUTRO" && <Field label="Descreva o objetivo"><Input name="goalOther" /></Field>}
          <Field label="Informações relevantes" hint="Lesões, restrições, histórico, preferências." className="sm:col-span-2"><Textarea name="info" /></Field>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="mb-1 font-display text-lg font-bold uppercase">Mensalidade</h2>
        <p className="mb-4 text-sm text-muted">Deixe o valor vazio para configurar depois.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Plano">
            <Select name="planId" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              <option value="">Personalizado</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Valor mensal (R$)"><Input name="amount" inputMode="decimal" defaultValue={price != null ? String(price) : ""} key={planId} /></Field>
          <Field label="Primeiro vencimento" hint="A cada pagamento o vencimento avança um mês."><Input name="firstDueDate" type="date" defaultValue={firstDue} /></Field>
          <Field label="Forma de pagamento">
            <Select name="method" defaultValue="PIX">
              {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Observações financeiras" className="sm:col-span-2"><Textarea name="financeNotes" className="min-h-16" /></Field>
        </div>
      </Card>

      {state?.error && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-text">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending && <Loader2 aria-hidden className="size-5 animate-spin" />} Cadastrar aluno
      </Button>
    </form>
  );
}
