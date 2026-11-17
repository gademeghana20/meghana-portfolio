import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ProjectForm } from "@/features/portfolio-management/projects/ProjectForm";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="text-sm text-muted hover:text-accent">
        ← Back to projects
      </Link>
      <div className="mt-4">
        <PageHeader title="Add project" />
      </div>
      <ProjectForm />
    </div>
  );
}
