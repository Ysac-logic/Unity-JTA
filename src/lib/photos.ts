import "server-only";
import path from "node:path";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

/** Fotos ficam fora de /public: só são entregues pela rota /api/photos/[id] após checagem de permissão. */
const ROOT = path.resolve(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"), "photos");

export const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic" };
export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
export const STORED_PHOTO_MIME = "image/webp";

export async function savePhotoFile(studentId: string, file: File) {
  if (!PHOTO_TYPES[file.type]) throw new Error("Formato não suportado. Use JPG, PNG ou WEBP.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("A foto deve ter no máximo 12 MB.");
  let buf: Buffer;
  try {
    buf = await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  } catch {
    throw new Error("Não foi possível processar a imagem. Use JPG, PNG ou WEBP.");
  }
  const rel = path.posix.join(studentId, `${randomUUID()}.webp`);
  await mkdir(path.join(ROOT, studentId), { recursive: true });
  await writeFile(path.join(ROOT, rel), buf);
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
