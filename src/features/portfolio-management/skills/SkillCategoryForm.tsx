import { SelectField, TextAreaField, TextField } from "@/components/ui/form";
import { iconOptions } from "@/lib/validation/skills";
import { AdminForm } from "../AdminForm";
import { saveSkillCategory } from "./actions";

export interface CategoryValues {
  id: string;
  title: string;
  icon: string;
  professional: string[];
  project: string[];
  familiar: string[];
}

export function SkillCategoryForm({ item }: { item?: CategoryValues }) {
  return (
    <AdminForm action={saveSkillCategory} submitLabel="Save category">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <TextField name="title" label="Category name" defaultValue={item?.title} required />
      <SelectField
        name="icon"
        label="Icon"
        defaultValue={item?.icon ?? "code"}
        options={[...iconOptions]}
      />
      <p className="text-sm text-muted">
        Add one skill per line. Put each skill under the heading that honestly
        describes your experience with it. Editing a list replaces the old one.
      </p>
      <TextAreaField
        name="professional"
        label="Used professionally"
        hint="Skills you use in your job."
        defaultValue={item?.professional.join("\n")}
        rows={6}
      />
      <TextAreaField
        name="project"
        label="Used in projects"
        hint="Skills you have built projects with."
        defaultValue={item?.project.join("\n")}
        rows={5}
      />
      <TextAreaField
        name="familiar"
        label="Familiar"
        hint="Skills you know the basics of."
        defaultValue={item?.familiar.join("\n")}
        rows={5}
      />
    </AdminForm>
  );
}
