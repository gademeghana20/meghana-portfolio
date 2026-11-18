import Image from "next/image";
import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { AdminForm } from "@/features/portfolio-management/AdminForm";
import { saveAbout } from "@/features/portfolio-management/profile/actions";
import { CheckboxField, FileField, TextAreaField, TextField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/server";

export default async function AboutAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data: p } = await db.from("profile").select("*").eq("id", 1).single();
  if (!p) return <p className="text-danger">Could not load your profile.</p>;

  const photoUrl = p.photo_path
    ? db.storage.from("project-images").getPublicUrl(p.photo_path).data.publicUrl
    : null;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="About Me"
        description="Your name, headline, introduction, summary and photo. Saving updates your public site right away."
      />
      <AdminForm action={saveAbout}>
        <div className="space-y-3">
          {photoUrl && (
            <div>
              <p className="mb-2 text-sm font-medium">Current photo</p>
              <Image
                src={photoUrl}
                alt="Your current profile photo"
                width={150}
                height={200}
                className="h-[200px] w-[150px] rounded-t-full rounded-b-2xl border border-border object-cover object-[50%_20%]"
              />
            </div>
          )}
          <FileField
            name="photo"
            label={photoUrl ? "Replace photo" : "Profile photo"}
            hint="PNG, JPG or WebP, up to 4 MB. A portrait (taller than wide) with your face in the upper half works best. It is cropped into an arch shape."
            accept="image/png,image/jpeg,image/webp"
          />
          {photoUrl && <CheckboxField name="remove_photo" label="Remove the current photo" />}
        </div>

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
