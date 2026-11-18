import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utilities/cn";
import { Reveal } from "./Reveal";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal className="mb-10">
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-accent">
        <span aria-hidden="true" className="h-px w-8 bg-accent/60" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="chip inline-block rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  external,
  className,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-accent-fill text-on-accent hover:bg-accent-fill-hover"
      : "border border-border bg-surface text-foreground hover:border-accent hover:text-accent",
    className,
  );
  if (external) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.endsWith(".pdf")) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
