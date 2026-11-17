import { z } from "zod";

export const certificationSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Keep it under 200 characters."),
  issuer: z
    .string()
    .trim()
    .min(1, "Issuer is required.")
    .max(150, "Keep it under 150 characters."),
  issued_on: z.string().trim().max(40, "Keep it under 40 characters."),
  url: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), {
      message: "Must start with https:// (or leave empty).",
    }),
});
