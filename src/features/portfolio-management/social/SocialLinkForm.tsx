"use client";

import { useContext, useState } from "react";
import { FieldErrorsContext, TextField } from "@/components/ui/form";
import { defaultLabel, socialPlatforms } from "@/lib/social-platforms";
import { AdminForm } from "../AdminForm";
import { saveSocialLink } from "./actions";

export interface SocialLinkValues {
  id: string;
  platform: string;
  label: string;
  url: string;
}

const control =
  "mt-1.5 w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent";

/** Platform + display name. Picking a platform suggests its name until you type your own. */
function PlatformFields({ item }: { item?: SocialLinkValues }) {
  const errors = useContext(FieldErrorsContext);
  const [platform, setPlatform] = useState(item?.platform ?? "github");
  const [label, setLabel] = useState(item?.label ?? defaultLabel(item?.platform ?? "github"));
  const [custom, setCustom] = useState(Boolean(item?.label));

  return (
    <>
      <div>
        <label htmlFor="platform" className="text-sm font-medium">
          Platform
        </label>
        <p className="mt-0.5 text-xs text-muted">
          Sets the icon. Pick Other for anything not listed.
        </p>
        <select
          id="platform"
          name="platform"
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
            if (!custom) setLabel(defaultLabel(e.target.value));
          }}
          className={`${control} ${errors.platform ? "border-danger" : "border-border"}`}
        >
          {socialPlatforms.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.platform && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {errors.platform}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="label" className="text-sm font-medium">
          Display name
        </label>
        <p className="mt-0.5 text-xs text-muted">
          Shown on your site, e.g. GitHub or My Blog.
        </p>
        <input
          id="label"
          name="label"
          type="text"
          required
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setCustom(true);
          }}
          aria-invalid={!!errors.label}
          className={`${control} ${errors.label ? "border-danger" : "border-border"}`}
        />
        {errors.label && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {errors.label}
          </p>
        )}
      </div>
    </>
  );
}

export function SocialLinkForm({ item }: { item?: SocialLinkValues }) {
  return (
    <AdminForm
      action={saveSocialLink}
      intents={[
        { value: "draft", label: "Save as hidden" },
        { value: "publish", label: "Save & show on site", primary: true },
      ]}
    >
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <PlatformFields item={item} />
      <TextField
        name="url"
        type="url"
        label="Link"
        hint="The full web address, starting with https://"
        placeholder="https://…"
        defaultValue={item?.url ?? ""}
        required
      />
    </AdminForm>
  );
}
