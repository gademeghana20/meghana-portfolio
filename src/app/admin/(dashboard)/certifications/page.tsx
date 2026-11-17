import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";

export default async function CertificationsAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("certifications")
    .select("id, title, issuer, issued_on, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Certifications & achievements"
        description="Only add genuine certifications and achievements. Published entries appear on your public site in this order."
      />
      <ItemList
        table="certifications"
        basePath="/admin/certifications"
        addLabel="Add certification"
        emptyText="No certifications yet."
        items={(data ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: [c.issuer, c.issued_on].filter(Boolean).join(" · "),
          published: c.is_published,
        }))}
      />
    </div>
  );
}
