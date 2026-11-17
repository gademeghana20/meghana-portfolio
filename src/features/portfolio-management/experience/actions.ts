"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { experienceSchema, toLines, toList } from "@/lib/validation/lists";
import { adminDb, refreshPublicSite, saveFailed, validationError } from "../server";
import type { ActionState } from "../types";

const LIST_PATH = "/admin/experience";

export async function saveExperience(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { id, end_date, responsibilities, technologies, ...rest } = parsed.data;
  const published = formData.get("intent") === "publish";
  const row = {
    ...rest,
    end_date: end_date === "" ? null : end_date,
    responsibilities: toLines(responsibilities),
    technologies: toList(technologies),
    is_published: published,
  };

  if (id) {
    const { data, error } = await db
      .from("experiences")
      .update(row)
      .eq("id", id)
      .select("id");
    if (error || data?.length !== 1) return saveFailed;
  } else {
    const { data: last } = await db
      .from("experiences")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const { error } = await db.from("experiences").insert({ ...row, sort_order });
    if (error) return saveFailed;
  }

  refreshPublicSite();
  revalidatePath(LIST_PATH);
  if (!id) redirect(LIST_PATH);
  return {
    status: "success",
    message: published
      ? "Saved and published. It's live on your site."
      : "Saved as draft. It is hidden from your public site.",
  };
}
