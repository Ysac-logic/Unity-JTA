import "server-only";
import path from "node:path";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

/** Fotos ficam fora de /public: só são entregues pela rota /api/photos/[id] após checagem de permissão. */
const ROOT = path.join(process.cwd(), "storage", "photos");

export const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic" };
export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;

export async function savePhotoFile(studentId: string, file: File) {
  const ext = PHOTO_TYPES[file.type];
  if (!ext) throw new Error("Formato não suportado. Use JPG, PNG ou WEBP.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("A foto deve ter no máximo 12 MB.");
  const rel = path.posix.join(studentId, `${randomUUID()}.${ext}`);
  await mkdir(path.join(ROOT, studentId), { recursive: true });
  await writeFile(path.join(ROOT, rel), Buffer.from(await file.arrayBuffer()));
  return rel;
}

function resolveSafe(rel: string) {
  const full = path.resolve(ROOT, rel);
  if (!full.startsWith(ROOT + path.sep)) throw new Error("Caminho inválido.");
  return full;
}

export const readPhotoFile = (rel: string) => readFile(resolveSafe(rel));

export async function deletePhotoFile(rel: string) {
  try {
    await unlink(resolveSafe(rel));
  } catch {}
}
