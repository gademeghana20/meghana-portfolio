import { z } from "zod";

const required = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optional = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters.`);

export const experienceSchema = z.object({
  id: z.string(),
  company: required("Company", 150),
  role: required("Role", 150),
  start_date: required("Start date", 40),
  end_date: optional(40), // empty = present
  responsibilities: required("Responsibilities", 5000),
  technologies: optional(1000),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: required("Degree", 200),
  specialization: required("Specialization", 200),
  institution: optional(200),
  graduation_year: z.coerce
    .number({ error: "Enter a year, e.g. 2026." })
    .int("Enter a whole year.")
    .min(1950, "Enter a valid year.")
    .max(2100, "Enter a valid year."),
  notes: optional(1000),
});

/** One item per line. */
export const toLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

/** Comma-separated list. */
export const toList = (text: string) =>
  text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
