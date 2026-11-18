"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Light/dark switch. The current theme lives on <html data-theme>; the icon is
 * chosen with CSS so there is no server/client mismatch.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    // Briefly enable color fading so the switch is smooth, not a snap.
    root.classList.add("theme-switching");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-switching"), 400);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the choice still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`inline-flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <Sun size={16} aria-hidden="true" className="hidden dark:block" />
      <Moon size={16} aria-hidden="true" className="dark:hidden" />
    </button>
  );
}
