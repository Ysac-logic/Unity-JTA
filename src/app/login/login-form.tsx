"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { login } from "@/app/actions/auth";
import { Button, Field, Input } from "@/components/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-8 space-y-4" noValidate>
      <Field label="E-mail">
        <span className="relative"><Mail aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-text" /><Input name="email" type="email" autoComplete="email" inputMode="email" required className="pl-11" aria-describedby={state?.error ? "login-error" : undefined} /></span>
      </Field>
      <Field label="Senha">
        <div className="relative">
          <Lock aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-text" />
          <Input name="password" type={show ? "text" : "password"} autoComplete="current-password" required className="pl-11 pr-12" />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted hover:text-fg cursor-pointer"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </Field>
      {state?.error && (
        <p id="login-error" role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-text">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {pending ? "Entrando" : "Entrar"}
      </Button>
    </form>
  );
}
