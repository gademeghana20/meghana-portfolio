import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { SkillCategoryForm } from "@/features/portfolio-management/skills/SkillCategoryForm";

export default async function NewSkillCategoryPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/skills" className="text-sm text-muted hover:text-accent">
        ← Back to skills
      </Link>
      <div className="mt-4">
        <PageHeader title="Add skill category" />
      </div>
      <SkillCategoryForm />
    </div>
  );
}
