"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Check } from "lucide-react";
import { Button, Field, Input, Select } from "./ui";

export function PhotoUpload({ studentId, defaultDate }: { studentId: string; defaultDate: string }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("studentId", studentId);
    try {
      const res = await fetch("/api/photos", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg({ ok: true, text: "Foto enviada. Ela já está visível para a equipe." });
      form.current?.reset();
      setPreview(null);
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error && err.message ? err.message : "Falha no envio. Tente novamente." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={form} onSubmit={submit} className="space-y-4">
      <label className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-line-strong bg-surface-2 text-center transition-colors hover:border-brand-text focus-within:border-brand-text sm:aspect-[16/7]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização da foto" className="absolute inset-0 size-full object-contain" />
        ) : (
          <>
            <Camera aria-hidden className="size-8 text-muted" />
            <span className="font-semibold">Tirar ou escolher foto</span>
            <span className="text-xs text-subtle">JPG, PNG ou WEBP até 12 MB</span>
          </>
        )}
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          required
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ângulo" required>
          <Select name="angle" defaultValue="FRONT">
            <option value="FRONT">Frente</option>
            <option value="BACK">Costas</option>
            <option value="SIDE">Lateral</option>
          </Select>
        </Field>
        <Field label="Data do registro" required>
          <Input type="date" name="takenAt" defaultValue={defaultDate} max={defaultDate} />
        </Field>
      </div>
      {msg && (
        <p role="status" className={msg.ok ? "flex items-center gap-2 text-sm text-ok" : "text-sm text-brand-text"}>
          {msg.ok && <Check aria-hidden className="size-4" />}
          {msg.text}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {busy ? "Enviando" : "Enviar foto"}
      </Button>
      <p className="text-xs text-subtle">Privado: visível apenas para você e para a equipe LOW UNITY JTA.</p>
    </form>
  );
}
