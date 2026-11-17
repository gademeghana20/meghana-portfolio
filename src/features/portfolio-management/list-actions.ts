"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adminDb, refreshPublicSite } from "./server";
import { removeFile } from "./storage";

// Only these tables may be changed through the generic list actions.
const tables = {
  experiences: "/admin/experience",
  education: "/admin/education",
  projects: "/admin/projects",
  certifications: "/admin/certifications",
  skill_categories: "/admin/skills",
} as const;

type Table = keyof typeof tables;

// Tables that have an is_published draft flag.
const hasDraftFlag = (t: Table) => t !== "skill_categories";

const input = z.object({
  table: z.enum(Object.keys(tables) as [Table, ...Table[]]),
  id: z.uuid(),
});

export type ListResult = { ok: boolean; message?: string };
const fail: ListResult = { ok: false, message: "Something went wrong. Please try again." };

function done(table: Table): ListResult {
  refreshPublicSite();
  revalidatePath(tables[table]);
  return { ok: true };
}

export async function setPublished(
  table: string,
  id: string,
  published: boolean,
): Promise<ListResult> {
  const db = await adminDb();
  const p = input.safeParse({ table, id });
  if (!p.success || !hasDraftFlag(p.data.table)) return fail;
  const { data, error } = await db
    .from(p.data.table)
    .update({ is_published: published })
    .eq("id", p.data.id)
    .select("id");
  if (error || data?.length !== 1) return fail;
  return done(p.data.table);
}

export async function deleteItem(table: string, id: string): Promise<ListResult> {
  const db = await adminDb();
  const p = input.safeParse({ table, id });
  if (!p.success) return fail;

  // Remember uploaded files so they can be cleaned up after the row is gone.
  let imagePath: string | null = null;
  let bucket = "";
  if (p.data.table === "projects") {
    const { data } = await db.from("projects").select("image_path").eq("id", p.data.id).maybeSingle();
    imagePath = data?.image_path ?? null;
    bucket = "project-images";
  } else if (p.data.table === "certifications") {
    const { data } = await db.from("certifications").select("file_path").eq("id", p.data.id).maybeSingle();
    imagePath = data?.file_path ?? null;
    bucket = "certificates";
  }

  const { data, error } = await db
    .from(p.data.table)
    .delete()
    .eq("id", p.data.id)
    .select("id");
  if (error || data?.length !== 1) return fail;

  if (imagePath) await removeFile(db, bucket, imagePath);
  return done(p.data.table);
}

export async function moveItem(
  table: string,
  id: string,
  direction: "up" | "down",
): Promise<ListResult> {
  const db = await adminDb();
  const p = input.safeParse({ table, id });
  if (!p.success) return fail;

  const { data: rows, error } = await db
    .from(p.data.table)
    .select("id")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !rows) return fail;

  const ids = rows.map((r) => r.id as string);
  const from = ids.indexOf(p.data.id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return { ok: true };
  [ids[from], ids[to]] = [ids[to], ids[from]];

  // Renumber every row so order is always 0..n-1 with no ties.
  for (let i = 0; i < ids.length; i++) {
    const r = await db.from(p.data.table).update({ sort_order: i }).eq("id", ids[i]);
    if (r.error) return fail;
  }
  return done(p.data.table);
}
