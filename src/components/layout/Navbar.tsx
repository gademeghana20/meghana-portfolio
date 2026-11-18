"use client";

import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({
  name,
  resumeUrl,
}: {
  name: string;
  resumeUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8"
      >
        <a href="#home" className="font-display text-lg font-medium tracking-tight">
          {name}
        </a>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-5 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
                >
                  <Download size={14} aria-hidden="true" /> Resume
                </a>
              </li>
            )}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            className="rounded-md p-2 text-muted hover:text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col px-5 py-2 sm:px-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  className="block py-3 text-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center gap-2 py-3 text-accent"
                >
                  <Download size={16} aria-hidden="true" /> Download Resume
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
