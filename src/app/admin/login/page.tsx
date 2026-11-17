import { LoginForm } from "@/features/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          Private area. Authorized account only.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
