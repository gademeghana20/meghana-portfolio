import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/form";
import { projectStatuses } from "@/lib/validation/projects";
import { AdminForm } from "../AdminForm";
import { saveProject } from "./actions";
import { ProjectImagesField, type ExistingImage } from "./ProjectImagesField";

export interface ProjectValues {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  overview: string;
  problem: string;
  features: string[];
  stack: string[];
  contribution: string;
  implementation: string[];
  status: string;
  github_url: string | null;
  live_url: string | null;
  images: ExistingImage[];
}

export function ProjectForm({ item }: { item?: ProjectValues }) {
  return (
    <AdminForm
      action={saveProject}
      intents={[
        { value: "draft", label: "Save as draft" },
        { value: "publish", label: "Save & publish", primary: true },
      ]}
    >
      <input type="hidden" name="id" value={item?.id ?? ""} />

      <TextField name="title" label="Project title" defaultValue={item?.title} required />
      <TextField
        name="slug"
        label="Link name"
        hint="Used in the project's web address, e.g. resolveiq. Leave empty to build it from the title."
        defaultValue={item?.slug}
      />
      <TextAreaField
        name="short_description"
        label="Short description"
        hint="Shown on the project card."
        defaultValue={item?.short_description}
        rows={3}
        required
      />
      <SelectField
        name="status"
        label="Status"
        defaultValue={item?.status ?? "in-development"}
        options={[...projectStatuses]}
      />

      <TextAreaField
        name="overview"
        label="Overview"
        defaultValue={item?.overview}
        rows={4}
      />
      <TextAreaField
        name="problem"
        label="Problem being solved"
        defaultValue={item?.problem}
        rows={4}
      />
      <TextAreaField
        name="features"
        label="Key features"
        hint="One per line. List only features that are implemented and working."
        defaultValue={item?.features.join("\n")}
        rows={6}
      />
      <TextField
        name="stack"
        label="Technologies"
        hint="Separate with commas, e.g. Python, YOLO, OpenCV"
        defaultValue={item?.stack.join(", ")}
      />
      <TextAreaField
        name="contribution"
        label="My contribution"
        defaultValue={item?.contribution}
        rows={4}
      />
      <TextAreaField
        name="implementation"
        label="Architecture / implementation details"
        hint="One per line."
        defaultValue={item?.implementation.join("\n")}
        rows={6}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="github_url"
          type="url"
          label="GitHub repository URL"
          placeholder="https://github.com/…"
          defaultValue={item?.github_url ?? ""}
        />
        <TextField
          name="live_url"
          type="url"
          label="Live demo URL"
          placeholder="https://…"
          defaultValue={item?.live_url ?? ""}
        />
      </div>

      <ProjectImagesField initial={item?.images ?? []} />
    </AdminForm>
  );
}
