import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { AdminForm } from "@/features/portfolio-management/AdminForm";
import { saveAbout } from "@/features/portfolio-management/profile/actions";
import { TextAreaField, TextField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/server";

export default async function AboutAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data: p } = await db.from("profile").select("*").eq("id", 1).single();
  if (!p) return <p className="text-red-400">Could not load your profile.</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="About Me"
        description="Your name, headline, introduction and summary. Saving updates your public site right away."
      />
      <AdminForm action={saveAbout}>
        <TextField name="name" label="Name" defaultValue={p.name} required />
        <TextField
          name="designation"
          label="Professional designation"
          defaultValue={p.designation}
          required
        />
        <TextField name="headline" label="Hero headline" defaultValue={p.headline} required />
        <TextAreaField
          name="intro"
          label="Short introduction"
          hint="Shown under the headline on the home screen."
          defaultValue={p.intro}
          rows={3}
          required
        />
        <TextAreaField
          name="summary"
          label="Professional summary"
          hint="Separate paragraphs with a blank line."
          defaultValue={(p.summary as string[]).join("\n\n")}
          rows={10}
          required
        />
        <TextField
          name="career_interests"
          label="Career interests"
          defaultValue={p.career_interests}
        />
      </AdminForm>
    </div>
  );
}
