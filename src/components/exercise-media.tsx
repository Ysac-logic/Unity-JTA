import { PlayCircle } from "lucide-react";

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  return m?.[1] ?? null;
}

export function ExerciseMedia({ name, imageUrl, videoUrl }: { name: string; imageUrl?: string | null; videoUrl?: string | null }) {
  const yt = videoUrl ? youtubeId(videoUrl) : null;
  if (yt) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl border border-line bg-surface-2">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${yt}`}
          title={`Vídeo: ${name}`}
          loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={`Execução de ${name}`} loading="lazy" className="aspect-video w-full rounded-xl border border-line bg-surface-2 object-cover" />
      )}
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand-text hover:underline">
          <PlayCircle aria-hidden className="size-5" /> Ver vídeo de execução
        </a>
      )}
    </div>
  );
}
