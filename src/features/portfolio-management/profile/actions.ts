"use server";

import { revalidatePath } from "next/cache";
import {
  aboutSchema,
  contactSchema,
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
    // PostgREST reports an unknown column this way: the photo-crop SQL isn't applied yet.
    if (error?.code === "PGRST204") {
      return {
        status: "error",
        message:
          "The database needs a one-time update for photo framing. Run supabase/migrations/0003_photo_crop.sql in the Supabase SQL Editor, then save again.",
      };
    }
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
