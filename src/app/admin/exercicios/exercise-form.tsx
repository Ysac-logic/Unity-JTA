"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveExercise } from "@/app/actions/exercises";
import { CATEGORIES } from "@/lib/exercisedb";

const MUSCLE_GROUPS: string[] = [...CATEGORIES];
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";

type E = { id?: string; name?: string; muscleGroup?: string; description?: string | null; instructions?: string | null; notes?: string | null; imageUrl?: string | null; videoUrl?: string | null; gifUrl?: string | null };

export function ExerciseForm({ initial = {} }: { initial?: E }) {
  const [state, action, pending] = useActionState(saveExercise, undefined);
  const groups = initial.muscleGroup && !MUSCLE_GROUPS.includes(initial.muscleGroup) ? [initial.muscleGroup, ...MUSCLE_GROUPS] : MUSCLE_GROUPS;
  return (
    <form action={action}>
      <Card className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <Field label="Nome" required><Input name="name" defaultValue={initial.name} required /></Field>
        <Field label="Grupo muscular" required>
          <Select name="muscleGroup" defaultValue={initial.muscleGroup ?? ""} required>
            <option value="" disabled>Selecione</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
        </Field>
        <Field label="Descrição" className="sm:col-span-2"><Input name="description" defaultValue={initial.description ?? ""} placeholder="Resumo curto" /></Field>
        <Field label="Instruções de execução" className="sm:col-span-2"><Textarea name="instructions" defaultValue={initial.instructions ?? ""} placeholder="Posicionamento, execução, respiração…" /></Field>
        <Field label="URL do GIF de demonstração" hint="Exibido em miniatura e na prévia ampliada." className="sm:col-span-2"><Input name="gifUrl" type="url" defaultValue={initial.gifUrl ?? ""} /></Field>
        <Field label="URL da imagem" hint="Link público de uma imagem (JPG, PNG, GIF)."><Input name="imageUrl" type="url" defaultValue={initial.imageUrl ?? ""} /></Field>
        <Field label="URL do vídeo" hint="YouTube é exibido dentro do app."><Input name="videoUrl" type="url" defaultValue={initial.videoUrl ?? ""} /></Field>
        <Field label="Observações internas" className="sm:col-span-2"><Textarea name="notes" defaultValue={initial.notes ?? ""} className="min-h-16" /></Field>
        {state?.error && <p role="alert" className="text-sm text-brand-text sm:col-span-2">{state.error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>{pending && <Loader2 aria-hidden className="size-4 animate-spin" />} Salvar exercício</Button>
        </div>
      </Card>
    </form>
  );
}
