"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { FieldErrorsContext, MarkDirtyContext } from "@/components/ui/form";
import { idle, type ActionState } from "./types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  /** Extra submit buttons; the clicked one is sent as the "intent" field. */
  intents?: { value: string; label: string; primary?: boolean }[];
};

/**
 * Wraps an admin edit form: shows success/error messages, per-field errors,
 * and warns before leaving the page with unsaved changes.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "Save changes",
  intents,
}: Props) {
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
        const submitter = (e.nativeEvent as SubmitEvent).submitter;
        const data = new FormData(e.currentTarget, submitter);
        setDirty(false);
        startTransition(() => dispatch(data));
      }}
      className="space-y-6"
    >
      <MarkDirtyContext value={() => setDirty(true)}>
        <FieldErrorsContext value={state.fieldErrors ?? {}}>
          {children}
        </FieldErrorsContext>
      </MarkDirtyContext>

      <div className="flex flex-wrap items-center gap-4">
        {(intents ?? [{ value: "save", label: submitLabel, primary: true }]).map((i) => (
          <button
            key={i.value}
            type="submit"
            name="intent"
            value={i.value}
            disabled={pending}
            className={
              i.primary
                ? "rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-fill-hover disabled:opacity-60"
                : "rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            }
          >
            {pending ? "Saving…" : i.label}
          </button>
        ))}
        {dirty && !pending && (
          <span className="text-sm text-warning">Unsaved changes</span>
        )}
        {state.status !== "idle" && !pending && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "success" ? "text-sm text-success" : "text-sm text-danger"
            }
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
