"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utilities/cn";

/** Field error messages, provided by AdminForm after a failed save. */
export const FieldErrorsContext = createContext<Record<string, string>>({});

const control =
  "mt-1.5 w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent";

function Shell({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "email" | "url";
  placeholder?: string;
};

export function TextField({
  name,
  label,
  defaultValue,
  hint,
  required,
  type = "text",
  placeholder,
}: FieldProps) {
  const error = useContext(FieldErrorsContext)[name];
  return (
    <Shell id={name} label={label} hint={hint} error={error}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(control, error ? "border-red-400" : "border-border")}
      />
    </Shell>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  hint,
  required,
  rows = 5,
}: Omit<FieldProps, "type" | "placeholder"> & { rows?: number }) {
  const error = useContext(FieldErrorsContext)[name];
  return (
    <Shell id={name} label={label} hint={hint} error={error}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(control, "leading-relaxed", error ? "border-red-400" : "border-border")}
      />
    </Shell>
  );
}
