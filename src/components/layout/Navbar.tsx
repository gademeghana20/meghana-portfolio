"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utilities/cn";

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

export function Navbar({ resumeUrl }: { resumeUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const close = () => setOpen(false);

  // Highlight the link for whichever section is crossing the middle of the screen.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-end px-5 sm:px-8 lg:justify-center"
      >
        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-5 lg:flex">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "link-underline text-sm hover:text-foreground",
                      isActive ? "text-foreground" : "text-muted",
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
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

      {/* Slides open/closed; `inert` keeps hidden links out of keyboard reach. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "grid border-border bg-background transition-[grid-template-rows,border-color] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="overflow-hidden">
          <ul className="mx-auto flex max-w-5xl flex-col px-5 py-2 sm:px-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  aria-current={active === l.href.slice(1) ? "true" : undefined}
                  className={cn(
                    "block py-3 hover:text-foreground",
                    active === l.href.slice(1) ? "text-accent" : "text-muted",
                  )}
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
      </div>
    </header>
  );
}
