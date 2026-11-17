"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toLines, toList } from "@/lib/validation/lists";
import { projectSchema } from "@/lib/validation/projects";
import { slugify } from "@/lib/validation/skills";
import { adminDb, refreshPublicSite, saveFailed, validationError } from "../server";
import { chosenFile, removeFile, uploadImage } from "../storage";
import type { ActionState } from "../types";

const LIST_PATH = "/admin/projects";
const BUCKET = "project-images";

export async function saveProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { id, slug, features, stack, implementation, github_url, live_url, ...rest } =
    parsed.data;
  const finalSlug = slug || slugify(rest.title);
  if (!finalSlug) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { slug: "Could not build a link from the title. Enter one." },
    };
  }

  const published = formData.get("intent") === "publish";
  const removeImage = formData.get("remove_image") === "on";
  const file = chosenFile(formData.get("image"));

  // Current image (if editing), so the old file can be deleted afterwards.
  let oldPath: string | null = null;
  if (id) {
    const { data } = await db.from("projects").select("image_path").eq("id", id).maybeSingle();
    if (!data) return saveFailed;
    oldPath = data.image_path;
  }

  let newPath: string | null = null;
  if (file) {
    const up = await uploadImage(db, BUCKET, file);
    if ("error" in up) {
      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        fieldErrors: { image: up.error },
      };
    }
    newPath = up.path;
  }

  const row = {
    ...rest,
    slug: finalSlug,
    features: toLines(features),
    stack: toList(stack),
    implementation: toLines(implementation),
    github_url: github_url === "" ? null : github_url,
    live_url: live_url === "" ? null : live_url,
    is_published: published,
    ...(newPath ? { image_path: newPath } : removeImage ? { image_path: null } : {}),
  };

  let failed: ActionState | null = null;
  if (id) {
    const { data, error } = await db.from("projects").update(row).eq("id", id).select("id");
    if (error || data?.length !== 1) failed = duplicateOr(error?.code);
  } else {
    const { data: last } = await db
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const { error } = await db.from("projects").insert({ ...row, sort_order });
    if (error) failed = duplicateOr(error.code);
  }

  if (failed) {
    await removeFile(db, BUCKET, newPath); // don't leave an orphan upload behind
    return failed;
  }

  if (oldPath && (newPath || removeImage)) await removeFile(db, BUCKET, oldPath);

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

function duplicateOr(code?: string): ActionState {
  if (code === "23505") {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { slug: "Another project already uses this link name." },
    };
  }
  return saveFailed;
}
