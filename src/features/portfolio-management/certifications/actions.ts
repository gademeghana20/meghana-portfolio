"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { certificationSchema } from "@/lib/validation/certifications";
import { adminDb, refreshPublicSite, saveFailed, validationError } from "../server";
import { chosenFile, removeFile, uploadFile } from "../storage";
import type { ActionState } from "../types";

const LIST_PATH = "/admin/certifications";
const BUCKET = "certificates";

export async function saveCertification(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const parsed = certificationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const { id, issued_on, url, ...rest } = parsed.data;
  const published = formData.get("intent") === "publish";
  const removeAttachment = formData.get("remove_file") === "on";
  const file = chosenFile(formData.get("file"));

  let oldPath: string | null = null;
  if (id) {
    const { data } = await db.from("certifications").select("file_path").eq("id", id).maybeSingle();
    if (!data) return saveFailed;
    oldPath = data.file_path;
  }

  let newPath: string | null = null;
  if (file) {
    const up = await uploadFile(db, BUCKET, file, {
      allowed: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
      typeError: "Use a PDF, PNG, JPG or WebP file.",
      sizeError: "File must be 4 MB or smaller.",
    });
    if ("error" in up) {
      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        fieldErrors: { file: up.error },
      };
    }
    newPath = up.path;
  }

  const row = {
    ...rest,
    issued_on: issued_on === "" ? null : issued_on,
    url: url === "" ? null : url,
    is_published: published,
    ...(newPath ? { file_path: newPath } : removeAttachment ? { file_path: null } : {}),
  };

  let failed = false;
  if (id) {
    const { data, error } = await db.from("certifications").update(row).eq("id", id).select("id");
    failed = !!error || data?.length !== 1;
  } else {
    const { data: last } = await db
      .from("certifications")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const { error } = await db.from("certifications").insert({ ...row, sort_order });
    failed = !!error;
  }

  if (failed) {
    await removeFile(db, BUCKET, newPath); // don't leave an orphan upload behind
    return saveFailed;
  }

  if (oldPath && (newPath || removeAttachment)) await removeFile(db, BUCKET, oldPath);

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
