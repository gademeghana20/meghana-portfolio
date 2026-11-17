export interface AdminNavItem {
  href: string;
  label: string;
  /** false = module not built yet, shown as "soon". */
  ready: boolean;
}

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Overview", ready: true },
  { href: "/admin/about", label: "About Me", ready: false },
  { href: "/admin/experience", label: "Experience", ready: false },
  { href: "/admin/education", label: "Education", ready: false },
  { href: "/admin/skills", label: "Skills", ready: false },
  { href: "/admin/projects", label: "Projects", ready: false },
  { href: "/admin/certifications", label: "Certifications", ready: false },
  { href: "/admin/resume", label: "Resume", ready: false },
  { href: "/admin/social", label: "Social Links", ready: false },
  { href: "/admin/contact", label: "Contact", ready: false },
];
