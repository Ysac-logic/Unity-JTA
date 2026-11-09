"use client";

import { useActionState } from "react";
import { createStaff } from "@/app/actions/team";
import { Button, Field, Input, Select } from "@/components/ui";

export function StaffForm() {
  const [state, action, pending] = useActionState(createStaff, undefined);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <Field label="Nome" required><Input name="name" required /></Field>
      <Field label="E-mail" required><Input name="email" type="email" required /></Field>
      <Field label="Telefone"><Input name="phone" type="tel" /></Field>
      <Field label="Função">
        <Select name="role" defaultValue="TRAINER"><option value="TRAINER">Personal trainer</option><option value="ADMIN">Administrador</option></Select>
      </Field>
      <Field label="Senha inicial" required><Input name="password" minLength={6} required autoComplete="off" /></Field>
      {state?.error && <p role="alert" className="text-sm text-brand-text sm:col-span-2">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-ok sm:col-span-2">Profissional adicionado à equipe.</p>}
      <div className="sm:col-span-2"><Button type="submit" disabled={pending}>Adicionar</Button></div>
    </form>
  );
}
