import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ProjectForm } from "@/features/portfolio-management/projects/ProjectForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditProjectPage(props: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const imageUrl = data.image_path
    ? db.storage.from("project-images").getPublicUrl(data.image_path).data.publicUrl
    : null;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="text-sm text-muted hover:text-accent">
        ← Back to projects
      </Link>
      <div className="mt-4">
        <PageHeader
          title="Edit project"
          description={data.is_published ? "Currently published." : "Currently a draft."}
        />
      </div>
      <ProjectForm item={{ ...data, imageUrl }} />
    </div>
  );
}
