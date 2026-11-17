import { z } from "zod";

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

export const aboutSchema = z.object({
  name: text("Name", 100),
  designation: text("Designation", 200),
  headline: text("Headline", 200),
  intro: text("Introduction", 500),
  summary: text("Professional summary", 4000),
  career_interests: z.string().trim().max(500, "Keep it under 500 characters."),
});

export const contactSchema = z.object({
  email: z.email("Enter a valid email address.").max(254),
});

// Only https links are accepted, so a typo can't publish a broken or unsafe URL.
const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), {
    message: "Must start with https:// (or leave empty to remove).",
  });

export const socialSchema = z.object({
  github: httpsUrl,
  linkedin: httpsUrl,
});
