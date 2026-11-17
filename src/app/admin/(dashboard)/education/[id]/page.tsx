import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { EducationForm } from "@/features/portfolio-management/education/EducationForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditEducationPage(
  props: PageProps<"/admin/education/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db.from("education").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/education" className="text-sm text-muted hover:text-accent">
        ← Back to education
      </Link>
      <div className="mt-4">
        <PageHeader
          title="Edit education"
          description={data.is_published ? "Currently published." : "Currently a draft."}
        />
      </div>
      <EducationForm item={data} />
    </div>
  );
}
