"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toLines } from "@/lib/validation/lists";
import { skillCategorySchema, slugify } from "@/lib/validation/skills";
import { adminDb, refreshPublicSite, saveFailed, validationError } from "../server";
import type { ActionState } from "../types";

const LIST_PATH = "/admin/skills";
const MAX_SKILL_LENGTH = 80;
const MAX_PER_LEVEL = 40;

type Level = "professional" | "project" | "familiar";

/** Builds the ordered, de-duplicated skill rows from the three text areas. */
function buildSkills(
  fields: Record<Level, string>,
): { skills: { name: string; level: Level }[] } | { fieldErrors: Record<string, string> } {
  const seen = new Set<string>();
  const skills: { name: string; level: Level }[] = [];
  const fieldErrors: Record<string, string> = {};

  for (const level of ["professional", "project", "familiar"] as const) {
    const lines = toLines(fields[level]);
    if (lines.length > MAX_PER_LEVEL) {
      fieldErrors[level] = `At most ${MAX_PER_LEVEL} skills here.`;
    }
    if (lines.some((l) => l.length > MAX_SKILL_LENGTH)) {
      fieldErrors[level] = `Each skill must be ${MAX_SKILL_LENGTH} characters or fewer.`;
    }
    for (const name of lines) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue; // same skill listed twice: keep the first
      seen.add(key);
      skills.push({ name, level });
    }
  }
  return Object.keys(fieldErrors).length ? { fieldErrors } : { skills };
}

export async function saveSkillCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = skillCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { id, title, icon, ...levels } = parsed.data;
  const built = buildSkills(levels);
  if ("fieldErrors" in built) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: built.fieldErrors,
    };
  }

  let categoryId = id;
  let oldSkillIds: string[] = [];

  if (id) {
    const { data, error } = await db
      .from("skill_categories")
      .update({ title, icon })
      .eq("id", id)
      .select("id");
    if (error || data?.length !== 1) return saveFailed;
    const { data: old } = await db.from("skills").select("id").eq("category_id", id);
    oldSkillIds = (old ?? []).map((s) => s.id);
  } else {
    const { data: last } = await db
      .from("skill_categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const slug = `${slugify(title) || "category"}-${randomBytes(3).toString("hex")}`;
    const { data, error } = await db
      .from("skill_categories")
      .insert({ title, icon, slug, sort_order })
      .select("id")
      .single();
    if (error || !data) return saveFailed;
    categoryId = data.id;
  }

  // Insert the new list first, then remove the old rows, so a failure part-way
  // never leaves the category empty.
  if (built.skills.length > 0) {
    const { error } = await db.from("skills").insert(
      built.skills.map((s, i) => ({
        category_id: categoryId,
        name: s.name,
        level: s.level,
        sort_order: i,
      })),
    );
    if (error) return saveFailed;
  }
  if (oldSkillIds.length > 0) {
    const { error } = await db.from("skills").delete().in("id", oldSkillIds);
    if (error) return saveFailed;
  }

  refreshPublicSite();
  revalidatePath(LIST_PATH);
  if (!id) redirect(LIST_PATH);
  return { status: "success", message: "Saved. Your public site is updated." };
}
