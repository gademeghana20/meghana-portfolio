import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side authorization check. Call it at the top of every admin page and
 * every admin server action. It verifies the session with Supabase Auth and
 * then confirms the user is on the admin allow-list (public.is_admin()).
 */
export const requireAdmin = cache(async () => {
  // Auth is always evaluated per request, never prerendered. This also lets the
  // session library read the current time without tripping prerender checks.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  return { id: user.id, email: user.email ?? "" };
});
