import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { CertificationForm } from "@/features/portfolio-management/certifications/CertificationForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditCertificationPage(
  props: PageProps<"/admin/certifications/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db.from("certifications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const fileUrl = data.file_path
    ? db.storage.from("certificates").getPublicUrl(data.file_path).data.publicUrl
    : null;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/certifications" className="text-sm text-muted hover:text-accent">
        ← Back to certifications
      </Link>
      <div className="mt-4">
        <PageHeader
          title="Edit certification"
          description={data.is_published ? "Currently published." : "Currently a draft."}
        />
      </div>
      <CertificationForm item={{ ...data, fileUrl }} />
    </div>
  );
}
