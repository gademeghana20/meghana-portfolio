import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { SocialLinkForm } from "@/features/portfolio-management/social/SocialLinkForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditSocialLinkPage(
  props: PageProps<"/admin/social/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db.from("social_links").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/social" className="text-sm text-muted hover:text-accent">
        ← Back to social links
      </Link>
      <div className="mt-4">
        <PageHeader
          title="Edit link"
          description={data.is_published ? "Currently shown on your site." : "Currently hidden."}
        />
      </div>
      <SocialLinkForm item={data} />
    </div>
  );
}
