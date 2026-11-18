import { z } from "zod";
import { platformValues } from "@/lib/social-platforms";

export const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.enum(platformValues, { error: "Choose a platform." }),
  label: z
    .string()
    .trim()
    .min(1, "A display name is required (e.g. GitHub).")
    .max(40, "Keep it under 40 characters."),
  // Only https links are accepted, so a typo can't publish a broken or unsafe URL.
  url: z
    .string()
    .trim()
    .min(1, "The link is required.")
    .max(300, "Keep it under 300 characters.")
    .refine((v) => /^https:\/\/[^\s]+\.[^\s]+$/.test(v), {
      message: "Must be a full link starting with https://",
    }),
});
