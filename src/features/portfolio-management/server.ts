import "server-only";
import { updateTag } from "next/cache";
import type { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PORTFOLIO_CACHE_TAG } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./types";

/** Every admin write starts here: verifies the admin, returns a DB client. */
export async function adminDb() {
  await requireAdmin();
  return createClient();
}

/** Makes the public site pick up the change immediately. */
export function refreshPublicSite() {
  updateTag(PORTFOLIO_CACHE_TAG);
}

export function validationError(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return {
    status: "error",
    message: "Please fix the highlighted fields.",
    fieldErrors,
  };
}

export const saveFailed: ActionState = {
  status: "error",
  message: "Could not save your changes. Please try again.",
};

/** Text area -> list. Blank lines separate items. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
