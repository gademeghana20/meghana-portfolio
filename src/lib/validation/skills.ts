import { z } from "zod";

export const iconOptions = [
  { value: "code", label: "Code (languages)" },
  { value: "layout", label: "Layout (frontend)" },
  { value: "server", label: "Server (backend)" },
  { value: "database", label: "Database" },
  { value: "brain", label: "Brain (AI / ML)" },
  { value: "wrench", label: "Wrench (tools)" },
] as const;

export const skillCategorySchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(80, "Keep it under 80 characters."),
  icon: z.enum(iconOptions.map((o) => o.value) as [string, ...string[]], {
    error: "Choose an icon.",
  }),
  professional: z.string().max(3000),
  project: z.string().max(3000),
  familiar: z.string().max(3000),
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
