import { requireStudent } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { EvolutionView } from "@/components/evolution";

export const metadata = { title: "Minha evolução" };

export default async function MyEvolution() {
  const { student } = await requireStudent();
  return (
    <>
      <PageHeader eyebrow="Físico e performance" title="Minha evolução" />
      <nav aria-label="Seções da evolução" className="mb-6 flex gap-2">
        {[["#fotos", "Fotos"], ["#medidas", "Medidas"], ["#cargas", "Cargas"]].map(([h, l]) => (
          <a key={h} href={h} className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm font-semibold text-muted hover:border-line-strong hover:text-fg">
            {l}
          </a>
        ))}
      </nav>
      <EvolutionView studentId={student.id} />
    </>
  );
}
