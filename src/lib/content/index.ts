import { cacheLife, cacheTag } from "next/cache";
import type {
  Certification,
  Education,
  Experience,
  PortfolioContent,
  Project,
  ProjectStatus,
  SkillCategory,
  SkillLevel,
  SocialLinks,
} from "@/types/portfolio";
import { createPublicClient } from "@/lib/supabase/public";

/** Cache tag revalidated by the admin dashboard after publishing changes. */
export const PORTFOLIO_CACHE_TAG = "portfolio";

/**
 * Loads everything the public site shows. Row Level Security guarantees only
 * published rows come back. Cached until the admin revalidates the tag, with a
 * 1-hour safety refresh.
 */
export async function getPortfolioContent(): Promise<PortfolioContent> {
  "use cache";
  cacheLife("hours");
  cacheTag(PORTFOLIO_CACHE_TAG);

  const db = createPublicClient();
  const byOrder = { ascending: true } as const;

  const [
    profile,
    settings,
    links,
    experiences,
    education,
    categories,
    projects,
    certifications,
  ] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).single(),
    db.from("site_settings").select("*").eq("id", 1).single(),
    db.from("social_links").select("*").order("sort_order", byOrder),
    db.from("experiences").select("*").order("sort_order", byOrder),
    db.from("education").select("*").order("sort_order", byOrder),
    db
      .from("skill_categories")
      .select("*, skills(*)")
      .order("sort_order", byOrder),
    db.from("projects").select("*").order("sort_order", byOrder),
    db.from("certifications").select("*").order("sort_order", byOrder),
  ]);

  for (const r of [
    profile, settings, links, experiences, education,
    categories, projects, certifications,
  ]) {
    if (r.error) throw new Error(`Failed to load portfolio content: ${r.error.message}`);
  }

  const publicUrl = (bucket: string, path: string | null) =>
    path ? db.storage.from(bucket).getPublicUrl(path).data.publicUrl : null;

  const social: SocialLinks = {
    github: links.data!.find((l) => l.platform === "github")?.url ?? null,
    linkedin: links.data!.find((l) => l.platform === "linkedin")?.url ?? null,
    email: profile.data!.email,
  };

  return {
    profile: {
      name: profile.data!.name,
      designation: profile.data!.designation,
      headline: profile.data!.headline,
      intro: profile.data!.intro,
      summary: profile.data!.summary,
      careerInterests: profile.data!.career_interests,
      photoUrl: publicUrl("project-images", profile.data!.photo_path),
      photoCrop: {
        zoom: Number(profile.data!.photo_zoom ?? 1),
        x: Number(profile.data!.photo_x ?? 50),
        y: Number(profile.data!.photo_y ?? 20),
      },
    },
    social,
    resumeUrl: publicUrl("resume", settings.data!.resume_path),
    experiences: experiences.data!.map(
      (e): Experience => ({
        id: e.id,
        company: e.company,
        role: e.role,
        startDate: e.start_date,
        endDate: e.end_date,
        responsibilities: e.responsibilities,
        technologies: e.technologies,
      }),
    ),
    education: education.data!.map(
      (e): Education => ({
        id: e.id,
        degree: e.degree,
        specialization: e.specialization,
        institution: e.institution,
        graduationYear: e.graduation_year,
        notes: e.notes,
      }),
    ),
    skillCategories: categories.data!
      .filter((c) => c.skills.length > 0)
      .map(
        (c): SkillCategory => ({
          id: c.id,
          title: c.title,
          icon: c.icon,
          skills: [...c.skills]
            .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
            .map((s: { name: string; level: SkillLevel }) => ({
              name: s.name,
              level: s.level,
            })),
        }),
      ),
    projects: projects.data!.map(
      (p): Project => ({
        slug: p.slug,
        title: p.title,
        shortDescription: p.short_description,
        overview: p.overview,
        problem: p.problem,
        features: p.features,
        stack: p.stack,
        contribution: p.contribution,
        implementation: p.implementation,
        status: p.status as ProjectStatus,
        githubUrl: p.github_url,
        liveUrl: p.live_url,
        imageUrl: publicUrl("project-images", p.image_path),
      }),
    ),
    certifications: certifications.data!.map(
      (c): Certification => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        date: c.issued_on,
        url: c.url ?? publicUrl("certificates", c.file_path),
      }),
    ),
  };
}
