import Link from "next/link";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { SocialLinkForm } from "@/features/portfolio-management/social/SocialLinkForm";

export default async function NewSocialLinkPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/social" className="text-sm text-muted hover:text-accent">
        ← Back to social links
      </Link>
      <div className="mt-4">
        <PageHeader title="Add link" />
      </div>
      <SocialLinkForm />
    </div>
  );
}
