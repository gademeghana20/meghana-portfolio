"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { socialLinkSchema } from "@/lib/validation/social";
import { adminDb, refreshPublicSite, saveFailed, validationError } from "../server";
import type { ActionState } from "../types";

const LIST_PATH = "/admin/social";

export async function saveSocialLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = socialLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { id, ...row } = parsed.data;
  // "Save as draft" hides the link from the public site without deleting it.
  const published = formData.get("intent") !== "draft";
  const values = { ...row, is_published: published };

  if (id) {
    const { data, error } = await db
      .from("social_links")
      .update(values)
      .eq("id", id)
      .select("id");
    if (error || data?.length !== 1) return saveFailed;
  } else {
    const { data: last } = await db
      .from("social_links")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const { error } = await db.from("social_links").insert({ ...values, sort_order });
    if (error) return saveFailed;
  }

  refreshPublicSite();
  revalidatePath(LIST_PATH);
  if (!id) redirect(LIST_PATH);
  return {
    status: "success",
    message: published
      ? "Saved. The link is live on your site."
      : "Saved as hidden. It is not shown on your public site.",
  };
}
