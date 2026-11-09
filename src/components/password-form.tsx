"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/team";
import { Button, Field, Input } from "./ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Senha atual">
        <Input type="password" name="current" autoComplete="current-password" required />
      </Field>
      <Field label="Nova senha" hint="Mínimo de 6 caracteres.">
        <Input type="password" name="next" autoComplete="new-password" minLength={6} required />
      </Field>
      {state?.error && <p role="alert" className="text-sm text-brand-text sm:col-span-2">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-ok sm:col-span-2">Senha alterada.</p>}
      <div className="sm:col-span-2">
        <Button type="submit" variant="secondary" disabled={pending}>Alterar senha</Button>
      </div>
    </form>
  );
}
