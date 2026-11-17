import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ExperienceForm } from "@/features/portfolio-management/experience/ExperienceForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditExperiencePage(
  props: PageProps<"/admin/experience/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db.from("experiences").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/experience" className="text-sm text-muted hover:text-accent">
        ← Back to experience
      </Link>
      <div className="mt-4">
        <PageHeader
          title="Edit experience"
          description={data.is_published ? "Currently published." : "Currently a draft."}
        />
      </div>
      <ExperienceForm item={data} />
    </div>
  );
}
