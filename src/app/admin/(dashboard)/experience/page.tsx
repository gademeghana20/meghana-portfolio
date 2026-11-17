import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";

export default async function ExperienceAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("experiences")
    .select("id, company, role, start_date, end_date, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Experience"
        description="Add, edit, reorder or remove work experience. Only published items appear on your public site."
      />
      <ItemList
        table="experiences"
        basePath="/admin/experience"
        addLabel="Add experience"
        emptyText="No experience yet."
        items={(data ?? []).map((e) => ({
          id: e.id,
          title: `${e.role} · ${e.company}`,
          subtitle: `${e.start_date} – ${e.end_date ?? "Present"}`,
          published: e.is_published,
        }))}
      />
    </div>
  );
}
