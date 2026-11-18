import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";

export default async function SocialAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("social_links")
    .select("id, label, url, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Social Links"
        description="Links to your profiles on any platform. Shown as icons in the hero and footer, and as cards in the Contact section, in this order. Hide a link to remove it from the site without deleting it."
      />
      <ItemList
        table="social_links"
        basePath="/admin/social"
        addLabel="Add link"
        emptyText="No links yet."
        items={(data ?? []).map((l) => ({
          id: l.id,
          title: l.label,
          subtitle: l.url,
          published: l.is_published,
        }))}
      />
    </div>
  );
}
