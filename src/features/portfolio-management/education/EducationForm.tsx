import { TextAreaField, TextField } from "@/components/ui/form";
import { AdminForm } from "../AdminForm";
import { saveEducation } from "./actions";

export interface EducationValues {
  id: string;
  degree: string;
  specialization: string;
  institution: string | null;
  graduation_year: number;
  notes: string | null;
}

export function EducationForm({ item }: { item?: EducationValues }) {
  return (
    <AdminForm
      action={saveEducation}
      intents={[
        { value: "draft", label: "Save as draft" },
        { value: "publish", label: "Save & publish", primary: true },
      ]}
    >
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <TextField name="degree" label="Degree" defaultValue={item?.degree} required />
      <TextField
        name="specialization"
        label="Specialization"
        defaultValue={item?.specialization}
        required
      />
      <TextField
        name="institution"
        label="College / university"
        hint="Shown on your site once filled in."
        defaultValue={item?.institution ?? ""}
      />
      <TextField
        name="graduation_year"
        label="Graduation year"
        defaultValue={item ? String(item.graduation_year) : ""}
        required
      />
      <TextAreaField
        name="notes"
        label="Academic achievements (optional)"
        defaultValue={item?.notes ?? ""}
        rows={3}
      />
    </AdminForm>
  );
}
