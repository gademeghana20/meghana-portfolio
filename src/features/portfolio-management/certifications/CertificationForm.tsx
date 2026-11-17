import { CheckboxField, FileField, TextField } from "@/components/ui/form";
import { AdminForm } from "../AdminForm";
import { saveCertification } from "./actions";

export interface CertificationValues {
  id: string;
  title: string;
  issuer: string;
  issued_on: string | null;
  url: string | null;
  fileUrl: string | null;
}

export function CertificationForm({ item }: { item?: CertificationValues }) {
  return (
    <AdminForm
      action={saveCertification}
      intents={[
        { value: "draft", label: "Save as draft" },
        { value: "publish", label: "Save & publish", primary: true },
      ]}
    >
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <TextField name="title" label="Certification / achievement" defaultValue={item?.title} required />
      <TextField name="issuer" label="Issued by" defaultValue={item?.issuer} required />
      <TextField
        name="issued_on"
        label="Date"
        hint="Any text, e.g. Aug 2026 (optional)"
        defaultValue={item?.issued_on ?? ""}
      />
      <TextField
        name="url"
        type="url"
        label="Credential link"
        hint="Optional. If empty and a file is attached, the file is linked instead."
        placeholder="https://…"
        defaultValue={item?.url ?? ""}
      />

      <div className="space-y-3">
        {item?.fileUrl && (
          <p className="text-sm">
            Attached file:{" "}
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              open current file
            </a>
          </p>
        )}
        <FileField
          name="file"
          label={item?.fileUrl ? "Replace file" : "Supporting image or PDF"}
          hint="PDF, PNG, JPG or WebP, up to 4 MB (optional)."
          accept="application/pdf,image/png,image/jpeg,image/webp"
        />
        {item?.fileUrl && <CheckboxField name="remove_file" label="Remove the attached file" />}
      </div>
    </AdminForm>
  );
}
