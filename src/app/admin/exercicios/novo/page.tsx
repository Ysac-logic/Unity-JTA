import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { ExerciseForm } from "../exercise-form";

export const metadata = { title: "Novo exercício" };

export default async function NewExercise() {
  await requireStaff();
  return (
    <>
      <Link href="/admin/exercicios" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Exercícios
      </Link>
      <PageHeader eyebrow="Biblioteca" title="Novo exercício" />
      <ExerciseForm />
    </>
  );
}
