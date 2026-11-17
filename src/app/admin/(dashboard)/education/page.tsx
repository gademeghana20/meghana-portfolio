import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";

export default async function EducationAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("education")
    .select("id, degree, specialization, graduation_year, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Education"
        description="Add, edit, reorder or remove education entries."
      />
      <ItemList
        table="education"
        basePath="/admin/education"
        addLabel="Add education"
        emptyText="No education yet."
        items={(data ?? []).map((e) => ({
          id: e.id,
          title: e.degree,
          subtitle: `${e.specialization} · ${e.graduation_year}`,
          published: e.is_published,
        }))}
      />
    </div>
  );
}
