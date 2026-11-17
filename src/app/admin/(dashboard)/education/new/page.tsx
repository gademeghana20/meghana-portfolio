import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { EducationForm } from "@/features/portfolio-management/education/EducationForm";

export default async function NewEducationPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/education" className="text-sm text-muted hover:text-accent">
        ← Back to education
      </Link>
      <div className="mt-4">
        <PageHeader title="Add education" />
      </div>
      <EducationForm />
    </div>
  );
}
