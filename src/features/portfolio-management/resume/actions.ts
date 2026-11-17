"use server";

import { revalidatePath } from "next/cache";
import { adminDb, refreshPublicSite, saveFailed } from "../server";
import { MAX_RESUME_BYTES, chosenFile, removeFile, uploadFile } from "../storage";
import type { ActionState } from "../types";

const BUCKET = "resume";
const PATH = "/admin/resume";

export async function saveResume(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const db = await adminDb();
  const file = chosenFile(formData.get("resume"));
  if (!file) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { resume: "Choose a PDF file to upload." },
    };
  }

  const { data: current } = await db.from("site_settings").select("resume_path").eq("id", 1).single();
  const oldPath = current?.resume_path ?? null;

  const up = await uploadFile(db, BUCKET, file, {
    allowed: ["application/pdf"],
    typeError: "The resume must be a PDF file.",
    maxBytes: MAX_RESUME_BYTES,
    sizeError: "The resume must be 5 MB or smaller.",
    filename: "Gade-Meghana-Resume.pdf",
  });
  if ("error" in up) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { resume: up.error },
    };
  }

  const { data, error } = await db
    .from("site_settings")
    .update({ resume_path: up.path })
    .eq("id", 1)
    .select("id");
  if (error || data?.length !== 1) {
    await removeFile(db, BUCKET, up.path); // keep the old resume if this failed
    return saveFailed;
  }

  await removeFile(db, BUCKET, oldPath); // replace: old file is deleted
  refreshPublicSite();
  revalidatePath(PATH);
  return {
    status: "success",
    message: "Resume uploaded. The Download Resume button now uses this file.",
  };
}

export async function removeResume(): Promise<{ ok: boolean; message?: string }> {
  const db = await adminDb();
  const { data: current } = await db.from("site_settings").select("resume_path").eq("id", 1).single();
  const oldPath = current?.resume_path ?? null;

  const { data, error } = await db
    .from("site_settings")
    .update({ resume_path: null })
    .eq("id", 1)
    .select("id");
  if (error || data?.length !== 1) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  await removeFile(db, BUCKET, oldPath);
  refreshPublicSite();
  revalidatePath(PATH);
  return { ok: true };
}
