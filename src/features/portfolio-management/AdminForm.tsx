"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { FieldErrorsContext } from "@/components/ui/form";
import { idle, type ActionState } from "./types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
};

/**
 * Wraps an admin edit form: shows success/error messages, per-field errors,
 * and warns before leaving the page with unsaved changes.
 */
export function AdminForm({ action, children, submitLabel = "Save changes" }: Props) {
  const [state, dispatch, pending] = useActionState(action, idle);
  const [dirty, setDirty] = useState(false);
  const [seen, setSeen] = useState(state);

  // A failed save leaves the edits unsaved again (derived during render).
  if (seen !== state) {
    setSeen(state);
    if (state.status === "error") setDirty(true);
  }

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <form
      noValidate
      onChange={() => setDirty(true)}
      onSubmit={(e) => {
        e.preventDefault(); // keeps typed values on screen after saving
        const data = new FormData(e.currentTarget);
        setDirty(false);
        startTransition(() => dispatch(data));
      }}
      className="space-y-6"
    >
      <FieldErrorsContext value={state.fieldErrors ?? {}}>
        {children}
      </FieldErrorsContext>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-[#0c0e13] transition-colors hover:bg-[#9aabff] disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {dirty && !pending && (
          <span className="text-sm text-amber-400">Unsaved changes</span>
        )}
        {state.status !== "idle" && !pending && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "success" ? "text-sm text-emerald-400" : "text-sm text-red-400"
            }
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
