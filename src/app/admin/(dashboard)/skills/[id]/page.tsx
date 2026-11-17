import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { SkillCategoryForm } from "@/features/portfolio-management/skills/SkillCategoryForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditSkillCategoryPage(
  props: PageProps<"/admin/skills/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await createClient();
  const { data } = await db
    .from("skill_categories")
    .select("id, title, icon, skills(name, level, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const byLevel = (level: string) =>
    [...data.skills]
      .filter((s) => s.level === level)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => s.name as string);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/skills" className="text-sm text-muted hover:text-accent">
        ← Back to skills
      </Link>
      <div className="mt-4">
        <PageHeader title={`Edit: ${data.title}`} />
      </div>
      <SkillCategoryForm
        item={{
          id: data.id,
          title: data.title,
          icon: data.icon,
          professional: byLevel("professional"),
          project: byLevel("project"),
          familiar: byLevel("familiar"),
        }}
      />
    </div>
  );
}
