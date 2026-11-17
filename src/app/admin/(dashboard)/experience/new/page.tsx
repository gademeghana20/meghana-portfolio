import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { ExperienceForm } from "@/features/portfolio-management/experience/ExperienceForm";

export default async function NewExperiencePage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/experience" className="text-sm text-muted hover:text-accent">
        ← Back to experience
      </Link>
      <div className="mt-4">
        <PageHeader title="Add experience" />
      </div>
      <ExperienceForm />
    </div>
  );
}
