import { requireAdmin } from "@/features/auth/dal";
import { PageHeader } from "@/features/dashboard/PageHeader";
import { AdminForm } from "@/features/portfolio-management/AdminForm";
import { saveContact } from "@/features/portfolio-management/profile/actions";
import { TextField } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/server";

export default async function ContactAdminPage() {
  await requireAdmin();
  const db = await createClient();
  const { data: p } = await db.from("profile").select("email").eq("id", 1).single();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Contact"
        description="The email address visitors see in the Contact section and footer."
      />
      <AdminForm action={saveContact}>
        <TextField
          name="email"
          type="email"
          label="Professional email"
          defaultValue={p?.email ?? ""}
          required
        />
      </AdminForm>
    </div>
  );
}
