import { Suspense, type ReactNode } from "react";
import { requireAdmin } from "@/features/auth/dal";
import { Sidebar } from "@/features/dashboard/Sidebar";

// Reading the session happens at request time, so it sits behind Suspense.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<p className="p-8 text-sm text-muted">Loading dashboard…</p>}
    >
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: ReactNode }) {
  const admin = await requireAdmin(); // redirects to /admin/login if not admin
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar email={admin.email} />
      <main className="min-w-0 flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
