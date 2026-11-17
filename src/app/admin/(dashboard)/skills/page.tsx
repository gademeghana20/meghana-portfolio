import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";

export default async function SkillsAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("skill_categories")
    .select("id, title, skills(count)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Skills"
        description="Organize your skills into categories. Open a category to add, edit or remove its skills. Changes go live right away."
      />
      <ItemList
        table="skill_categories"
        basePath="/admin/skills"
        addLabel="Add category"
        emptyText="No skill categories yet."
        items={(data ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: `${c.skills[0]?.count ?? 0} skills`,
        }))}
      />
    </div>
  );
}
