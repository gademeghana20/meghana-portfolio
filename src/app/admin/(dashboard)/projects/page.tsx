import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ItemList } from "@/features/portfolio-management/ItemList";
import { createClient } from "@/lib/supabase/server";
import { projectStatuses } from "@/lib/validation/projects";

export default async function ProjectsAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("projects")
    .select("id, title, status, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const statusLabel = (v: string) =>
    projectStatuses.find((s) => s.value === v)?.label ?? v;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Projects"
        description="Add, edit, reorder or remove projects. Only published projects appear on your public site, in this order."
      />
      <ItemList
        table="projects"
        basePath="/admin/projects"
        addLabel="Add project"
        emptyText="No projects yet."
        items={(data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: statusLabel(p.status),
          published: p.is_published,
        }))}
      />
    </div>
  );
}
