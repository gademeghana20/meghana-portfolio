import { cacheLife } from "next/cache";

// Cached so the current year can be computed without making the page dynamic.
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
