"use client";

import { useActionState, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { recordPayment } from "@/app/actions/finance";
import { METHODS } from "@/lib/labels";
import { Button, Field, Input, Select, Textarea } from "./ui";

export function PaymentForm({ invoices, defaultMethod, today }: { invoices: { id: string; label: string; amount: number }[]; defaultMethod: string; today: string }) {
  const [state, action, pending] = useActionState(recordPayment, undefined);
  const [inv, setInv] = useState(invoices[0]?.id ?? "");
  const amount = invoices.find((i) => i.id === inv)?.amount ?? 0;

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" key={invoices.map((i) => i.id).join()}>
      <Field label="Mensalidade" className="sm:col-span-2" required>
        <Select name="invoiceId" value={inv} onChange={(e) => setInv(e.target.value)}>
          {invoices.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </Select>
      </Field>
      <Field label="Valor pago (R$)" required>
        <Input name="amount" inputMode="decimal" defaultValue={String(amount)} key={inv} required />
      </Field>
      <Field label="Data do pagamento" required>
        <Input type="date" name="paidAt" defaultValue={today} max={today} required />
      </Field>
      <Field label="Forma de pagamento" required>
        <Select name="method" defaultValue={defaultMethod}>
          {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </Field>
      <Field label="Observação">
        <Textarea name="notes" className="min-h-12" rows={1} />
      </Field>
      {state?.error && <p role="alert" className="text-sm text-brand-text sm:col-span-2">{state.error}</p>}
      {state?.ok && (
        <p role="status" className="flex items-center gap-2 text-sm text-ok sm:col-span-2">
          <Check aria-hidden className="size-4" /> Pagamento registrado. Próximo vencimento gerado automaticamente.
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Confirmar pagamento
        </Button>
      </div>
    </form>
  );
}
