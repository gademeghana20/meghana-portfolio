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
