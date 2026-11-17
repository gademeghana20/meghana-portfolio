import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { CertificationForm } from "@/features/portfolio-management/certifications/CertificationForm";

export default async function NewCertificationPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/certifications" className="text-sm text-muted hover:text-accent">
        ← Back to certifications
      </Link>
      <div className="mt-4">
        <PageHeader title="Add certification" />
      </div>
      <CertificationForm />
    </div>
  );
}
