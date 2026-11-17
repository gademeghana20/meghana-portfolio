"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeResume } from "./actions";

export function RemoveResumeButton() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      const r = await removeResume();
      setError(r.ok ? null : (r.message ?? "Something went wrong."));
      setConfirming(false);
    });

  if (confirming) {
    return (
      <div role="alertdialog" aria-label="Remove resume" className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-red-400">
          Remove the resume? The Download Resume button will disappear from your site.
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400 disabled:opacity-50"
        >
          {pending ? "Removing…" : "Yes, remove"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-accent"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-red-400 hover:text-red-400"
      >
        <Trash2 size={13} aria-hidden="true" /> Remove resume
      </button>
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
