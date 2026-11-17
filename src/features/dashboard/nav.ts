export interface AdminNavItem {
  href: string;
  label: string;
  /** false = module not built yet, shown as "soon". */
  ready: boolean;
}

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Overview", ready: true },
  { href: "/admin/about", label: "About Me", ready: true },
  { href: "/admin/experience", label: "Experience", ready: true },
  { href: "/admin/education", label: "Education", ready: true },
  { href: "/admin/skills", label: "Skills", ready: true },
  { href: "/admin/projects", label: "Projects", ready: true },
  { href: "/admin/certifications", label: "Certifications", ready: true },
  { href: "/admin/resume", label: "Resume", ready: true },
  { href: "/admin/social", label: "Social Links", ready: true },
  { href: "/admin/contact", label: "Contact", ready: true },
];
