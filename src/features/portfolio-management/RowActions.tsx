"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteItem, moveItem, setPublished, type ListResult } from "./list-actions";

type Props = {
  table: string;
  id: string;
  title: string;
  published: boolean;
  editHref: string;
  isFirst: boolean;
  isLast: boolean;
};

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:border-accent hover:text-accent disabled:opacity-40";

export function RowActions({ table, id, title, published, editHref, isFirst, isLast }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<ListResult>) => {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setError(r.message ?? "Something went wrong.");
      setConfirming(false);
    });
  };

  if (confirming) {
    return (
      <div role="alertdialog" aria-label={`Delete ${title}`} className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-red-400">Delete &ldquo;{title}&rdquo; permanently?</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => deleteItem(table, id))}
          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400 disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Yes, delete"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className={btn}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-label="Move up"
        disabled={pending || isFirst}
        onClick={() => run(() => moveItem(table, id, "up"))}
        className={btn}
      >
        <ArrowUp size={13} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={pending || isLast}
        onClick={() => run(() => moveItem(table, id, "down"))}
        className={btn}
      >
        <ArrowDown size={13} aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => setPublished(table, id, !published))}
        className={btn}
      >
        {published ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
        {published ? "Unpublish" : "Publish"}
      </button>
      <Link href={editHref} className={btn}>
        <Pencil size={13} aria-hidden="true" /> Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(true)}
        className={`${btn} hover:!border-red-400 hover:!text-red-400`}
      >
        <Trash2 size={13} aria-hidden="true" /> Delete
      </button>
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
