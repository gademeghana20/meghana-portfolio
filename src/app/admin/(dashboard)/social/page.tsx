import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { AdminForm } from "@/features/portfolio-management/AdminForm";
import { saveSocialLinks } from "@/features/portfolio-management/profile/actions";
import { TextField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/server";

export default async function SocialAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data: links } = await db.from("social_links").select("platform, url");
  const url = (platform: string) =>
    links?.find((l) => l.platform === platform)?.url ?? "";

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Social Links"
        description="Links shown in the hero, Contact section and footer. Leave a field empty to remove that link."
      />
      <AdminForm action={saveSocialLinks}>
        <TextField
          name="github"
          type="url"
          label="GitHub"
          placeholder="https://github.com/your-username"
          defaultValue={url("github")}
        />
        <TextField
          name="linkedin"
          type="url"
          label="LinkedIn"
          placeholder="https://www.linkedin.com/in/your-profile"
          defaultValue={url("linkedin")}
        />
      </AdminForm>
    </div>
  );
}
