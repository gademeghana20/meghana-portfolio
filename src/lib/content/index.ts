import type { PortfolioContent } from "@/types/portfolio";
import { defaultContent } from "./defaults";

/** Single entry point for public content. Swapped to Supabase in Phase 3. */
export async function getPortfolioContent(): Promise<PortfolioContent> {
  return defaultContent;
}
