import "server-only";
import { randomUUID } from "node:crypto";

type Db = Awaited<ReturnType<typeof import("./server").adminDb>>;

const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export type UploadResult = { path: string } | { error: string };

/** Returns null when no file was chosen. */
export function chosenFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

/** Validates and uploads an image with the admin's own session (RLS applies). */
export async function uploadImage(
  db: Db,
  bucket: "project-images" | "certificates",
  file: File,
): Promise<UploadResult> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Use a PNG, JPG or WebP image." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Image must be 4 MB or smaller." };

  const path = `${randomUUID()}.${ext}`;
  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: "Could not upload the image. Please try again." };
  return { path };
}

export async function removeFile(db: Db, bucket: string, path: string | null) {
  if (!path) return;
  await db.storage.from(bucket).remove([path]);
}
