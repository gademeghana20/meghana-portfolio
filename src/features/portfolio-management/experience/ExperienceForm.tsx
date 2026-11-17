import { TextAreaField, TextField } from "@/components/ui/form";
import { AdminForm } from "../AdminForm";
import { saveExperience } from "./actions";

export interface ExperienceValues {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  responsibilities: string[];
  technologies: string[];
}

export function ExperienceForm({ item }: { item?: ExperienceValues }) {
  return (
    <AdminForm
      action={saveExperience}
      intents={[
        { value: "draft", label: "Save as draft" },
        { value: "publish", label: "Save & publish", primary: true },
      ]}
    >
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <TextField name="company" label="Company" defaultValue={item?.company} required />
      <TextField name="role" label="Role / designation" defaultValue={item?.role} required />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="start_date"
          label="Start date"
          hint="Any text, e.g. Nov 2025"
          defaultValue={item?.start_date}
          required
        />
        <TextField
          name="end_date"
          label="End date"
          hint="Leave empty if this is your current role."
          defaultValue={item?.end_date ?? ""}
        />
      </div>
      <TextAreaField
        name="responsibilities"
        label="Responsibilities and contributions"
        hint="One per line. Describe only what you actually did."
        defaultValue={item?.responsibilities.join("\n")}
        rows={8}
        required
      />
      <TextField
        name="technologies"
        label="Technologies"
        hint="Separate with commas, e.g. Angular, C#, SQL Server"
        defaultValue={item?.technologies.join(", ")}
      />
    </AdminForm>
  );
}
