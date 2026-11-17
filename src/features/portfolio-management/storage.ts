import "server-only";
import { randomUUID } from "node:crypto";

type Db = Awaited<ReturnType<typeof import("./server").adminDb>>;
type Bucket = "project-images" | "certificates" | "resume";

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export type UploadResult = { path: string } | { error: string };

/** Returns null when no file was chosen. */
export function chosenFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

/**
 * Validates and uploads a file with the admin's own session (RLS applies).
 * `filename` gives the stored file a friendly name inside a unique folder.
 */
export async function uploadFile(
  db: Db,
  bucket: Bucket,
  file: File,
  opts: {
    allowed: string[];
    typeError: string;
    maxBytes?: number;
    sizeError?: string;
    filename?: string;
  },
): Promise<UploadResult> {
  const ext = EXTENSIONS[file.type];
  if (!ext || !opts.allowed.includes(file.type)) return { error: opts.typeError };

  const max = opts.maxBytes ?? MAX_FILE_BYTES;
  if (file.size > max) {
    return { error: opts.sizeError ?? `File must be ${Math.round(max / 1048576)} MB or smaller.` };
  }

  // A PDF must really start with the PDF signature, not just claim the type.
  if (file.type === "application/pdf") {
    const head = await file.slice(0, 5).text();
    if (head !== "%PDF-") return { error: opts.typeError };
  }

  const path = opts.filename ? `${randomUUID()}/${opts.filename}` : `${randomUUID()}.${ext}`;
  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: "Could not upload the file. Please try again." };
  return { path };
}

export function uploadImage(db: Db, bucket: "project-images" | "certificates", file: File) {
  return uploadFile(db, bucket, file, {
    allowed: ["image/png", "image/jpeg", "image/webp"],
    typeError: "Use a PNG, JPG or WebP image.",
    sizeError: "Image must be 4 MB or smaller.",
  });
}

export async function removeFile(db: Db, bucket: string, path: string | null) {
  if (!path) return;
  await db.storage.from(bucket).remove([path]);
}
