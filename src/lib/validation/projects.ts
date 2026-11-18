import { z } from "zod";

const required = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep it under ${max} characters.`);

const optionalHttps = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), {
    message: "Must start with https:// (or leave empty).",
  });

export const projectStatuses = [
  { value: "in-development", label: "In development" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export const projectSchema = z.object({
  id: z.string(),
  title: required("Title", 150),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), {
      message: "Use lowercase letters, numbers and single hyphens only.",
    }),
  short_description: required("Short description", 300),
  overview: optionalText(3000),
  problem: optionalText(3000),
  features: optionalText(4000),
  stack: optionalText(1000),
  contribution: optionalText(3000),
  implementation: optionalText(4000),
  status: z.enum(projectStatuses.map((s) => s.value) as [string, ...string[]], {
    error: "Choose a status.",
  }),
  github_url: optionalHttps,
  live_url: optionalHttps,
});

export const MAX_PROJECT_IMAGES = 5;

/** One saved picture: where it is stored and how it is framed. */
export const storedImageSchema = z.object({
  path: z.string().min(1).max(300),
  zoom: z.coerce.number().min(1).max(3).catch(1),
  x: z.coerce.number().min(0).max(100).catch(50),
  y: z.coerce.number().min(0).max(100).catch(50),
});
export type StoredImage = z.infer<typeof storedImageSchema>;

/** Reads the `images` column safely, ignoring anything malformed. */
export function parseStoredImages(value: unknown): StoredImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => storedImageSchema.safeParse(v))
    .flatMap((r) => (r.success ? [r.data] : []))
    .slice(0, MAX_PROJECT_IMAGES);
}

/** A project row's pictures, falling back to the old single image column. */
export function storedImagesOf(row: { images?: unknown; image_path?: string | null }): StoredImage[] {
  const list = parseStoredImages(row.images);
  if (list.length === 0 && row.image_path) {
    return [{ path: row.image_path, zoom: 1, x: 50, y: 50 }];
  }
  return list;
}

/** What the form sends for each picture slot, in display order. */
export const imageSlotsSchema = z
  .array(
    z.object({
      kind: z.enum(["existing", "new"]),
      /** Stored path (existing) or a client key matching the file input (new). */
      ref: z.string().min(1).max(300),
      zoom: z.coerce.number().min(1).max(3).catch(1),
      x: z.coerce.number().min(0).max(100).catch(50),
      y: z.coerce.number().min(0).max(100).catch(50),
    }),
  )
  .max(MAX_PROJECT_IMAGES);
