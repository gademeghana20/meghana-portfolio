import Link from "next/link";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { logout } from "@/features/auth/actions";
import { adminNav } from "./nav";

export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <p className="font-semibold">Portfolio Admin</p>
        <p className="mt-0.5 truncate text-xs text-muted">{email}</p>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-x-auto px-3 pb-3">
        <ul className="flex gap-1 md:flex-col">
          {adminNav.map((item) => (
            <li key={item.href} className="shrink-0">
              {item.ready ? (
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted/60"
                >
                  {item.label}
                  <span className="ml-3 hidden text-[10px] uppercase tracking-wider md:inline">
                    soon
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-border p-3">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/" target="_blank" className="px-2 text-sm text-muted hover:text-accent">
            View site
          </Link>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <LogOut size={14} aria-hidden="true" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
