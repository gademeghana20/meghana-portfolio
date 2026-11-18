/** Platforms offered in the admin. "other" works for anything not listed. */
export const socialPlatforms = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website / Portfolio" },
  { value: "blog", label: "Blog (Medium, Dev.to, Hashnode…)" },
  { value: "x", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "leetcode", label: "LeetCode" },
  { value: "hackerrank", label: "HackerRank" },
  { value: "kaggle", label: "Kaggle" },
  { value: "stackoverflow", label: "Stack Overflow" },
  { value: "other", label: "Other" },
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number]["value"];

export const platformValues = socialPlatforms.map((p) => p.value) as [
  SocialPlatform,
  ...SocialPlatform[],
];

/** Default display name for a platform ("other" has none). */
export function defaultLabel(platform: string): string {
  const found = socialPlatforms.find((p) => p.value === platform);
  if (!found || found.value === "other") return "";
  return found.label.replace(/\s*\(.*\)$/, "");
}

/** "https://www.github.com/me/" -> "github.com/me" */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return u.hostname.replace(/^www\./, "") + path;
  } catch {
    return url;
  }
}
