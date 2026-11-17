import { FileText } from "lucide-react";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { AdminForm } from "@/features/portfolio-management/AdminForm";
import { saveResume } from "@/features/portfolio-management/resume/actions";
import { RemoveResumeButton } from "@/features/portfolio-management/resume/RemoveResumeButton";
import { FileField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/server";

export default async function ResumeAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data } = await db
    .from("site_settings")
    .select("resume_path, updated_at")
    .eq("id", 1)
    .single();

  const url = data?.resume_path
    ? db.storage.from("resume").getPublicUrl(data.resume_path).data.publicUrl
    : null;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Resume"
        description="Upload your resume as a PDF. The Download Resume buttons on your site always point to the latest file, and uploading a new one replaces the old one."
      />

      <div className="mb-8 rounded-xl border border-border bg-surface p-5">
        {url ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="text-accent" size={22} aria-hidden="true" />
              <div>
                <p className="font-medium">Current resume</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  Open the live file
                </a>
              </div>
            </div>
            <RemoveResumeButton />
          </div>
        ) : (
          <p className="text-muted">
            No resume uploaded yet. The Download Resume button is hidden on your
            site until you upload one.
          </p>
        )}
      </div>

      <AdminForm action={saveResume} submitLabel={url ? "Upload & replace" : "Upload resume"}>
        <FileField
          name="resume"
          label={url ? "New resume (replaces the current one)" : "Resume PDF"}
          hint="PDF only, up to 5 MB. Make sure it contains nothing confidential."
          accept="application/pdf"
        />
      </AdminForm>
    </div>
  );
}
