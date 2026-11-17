import { requireAdmin } from "@/features/auth/dal";
import { createClient } from "@/lib/supabase/server";

const tables = [
  { table: "experiences", label: "Experience" },
  { table: "education", label: "Education" },
  { table: "skills", label: "Skills" },
  { table: "projects", label: "Projects" },
  { table: "certifications", label: "Certifications" },
] as const;

export default async function AdminOverviewPage() {
  await requireAdmin();
  const supabase = await createClient();

  // The admin session sees drafts too (RLS "admin reads all").
  const counts = await Promise.all(
    tables.map(async ({ table, label }) => {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return { label, count: count ?? 0 };
    }),
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-2 text-muted">
        You are signed in. Content modules will appear in the sidebar as they
        are built.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {counts.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 text-3xl font-semibold">{c.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
