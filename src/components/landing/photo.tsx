import Image from "next/image";

export function Photo({ src, alt, label = "Foto", sizes = "100vw", priority, className = "" }: { src?: string; alt: string; label?: string; sizes?: string; priority?: boolean; className?: string }) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover grayscale ${className}`} />;
  }
  return (
    <div role="img" aria-label={alt} className={`lu-hatch absolute inset-0 flex items-end justify-start p-4 ${className}`}>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-lu-gray">{label}</span>
    </div>
  );
}
