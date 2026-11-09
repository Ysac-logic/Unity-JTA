import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { ExerciseMedia } from "@/components/exercise-media";
import { ExerciseForm } from "../exercise-form";

export const metadata = { title: "Editar exercício" };

export default async function EditExercise({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireStaff();
  const e = await db.exercise.findUnique({ where: { id } });
  if (!e) notFound();
  return (
    <>
      <Link href="/admin/exercicios" className="mb-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> Exercícios
      </Link>
      <PageHeader eyebrow={e.muscleGroup} title={e.name} />
      {(e.imageUrl || e.videoUrl || e.gifUrl) && (
        <div className="mb-6 max-w-xl">
          <ExerciseMedia name={e.name} imageUrl={e.imageUrl ?? e.gifUrl} videoUrl={e.videoUrl} />
        </div>
      )}
      <ExerciseForm initial={e} />
    </>
  );
}
