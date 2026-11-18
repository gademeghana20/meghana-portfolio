"use server";

import { revalidatePath } from "next/cache";
import {
  aboutSchema,
  contactSchema,
  socialSchema,
} from "@/lib/validation/profile";
import {
  adminDb,
  refreshPublicSite,
  saveFailed,
  toParagraphs,
  validationError,
} from "../server";
import { chosenFile, removeFile, uploadImage } from "../storage";
import type { ActionState } from "../types";

// Profile photos share the public image bucket used for project images.
const PHOTO_BUCKET = "project-images";

const saved: ActionState = {
  status: "success",
  message: "Saved. Your public site is updated.",
};

export async function saveAbout(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = aboutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { summary, ...rest } = parsed.data;

  // Optional photo: replace, remove, or leave as is.
  const file = chosenFile(formData.get("photo"));
  const removePhoto = formData.get("remove_photo") === "on";
  const { data: current } = await db.from("profile").select("photo_path").eq("id", 1).single();
  const oldPath = current?.photo_path ?? null;

  let newPath: string | null = null;
  if (file) {
    const up = await uploadImage(db, PHOTO_BUCKET, file);
    if ("error" in up) {
      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        fieldErrors: { photo: up.error },
      };
    }
    newPath = up.path;
  }

  const { data, error } = await db
    .from("profile")
    .update({
      ...rest,
      summary: toParagraphs(summary),
      ...(newPath ? { photo_path: newPath } : removePhoto ? { photo_path: null } : {}),
    })
    .eq("id", 1)
    .select("id");
  if (error || data?.length !== 1) {
    await removeFile(db, PHOTO_BUCKET, newPath); // don't leave an orphan upload
    return saveFailed;
  }

  if (oldPath && (newPath || removePhoto)) await removeFile(db, PHOTO_BUCKET, oldPath);

  refreshPublicSite();
  revalidatePath("/admin/about");
  return saved;
}

export async function saveContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await db
    .from("profile")
    .update({ email: parsed.data.email })
    .eq("id", 1)
    .select("id");
  if (error || data?.length !== 1) return saveFailed;

  refreshPublicSite();
  revalidatePath("/admin/contact");
  return saved;
}

export async function saveSocialLinks(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = socialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const platforms = [
    { platform: "github", label: "GitHub", url: parsed.data.github, order: 1 },
    { platform: "linkedin", label: "LinkedIn", url: parsed.data.linkedin, order: 2 },
  ];

  for (const p of platforms) {
    const existing = await db
      .from("social_links")
      .select("id")
      .eq("platform", p.platform)
      .maybeSingle();
    if (existing.error) return saveFailed;

    let result;
    if (p.url === "") {
      if (!existing.data) continue;
      result = await db.from("social_links").delete().eq("id", existing.data.id);
    } else if (existing.data) {
      result = await db
        .from("social_links")
        .update({ url: p.url })
        .eq("id", existing.data.id);
    } else {
      result = await db.from("social_links").insert({
        platform: p.platform,
        label: p.label,
        url: p.url,
        sort_order: p.order,
        is_published: true,
      });
    }
    if (result.error) return saveFailed;
  }

  refreshPublicSite();
  revalidatePath("/admin/social");
  return saved;
}
