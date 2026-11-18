export type SkillLevel = "professional" | "project" | "familiar";

export interface Profile {
  name: string;
  designation: string;
  headline: string;
  intro: string;
  summary: string[];
  careerInterests: string;
  photoUrl: string | null;
  photoCrop: { zoom: number; x: number; y: number };
}

export interface SocialLinks {
  github: string | null;
  linkedin: string | null;
  email: string | null;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null; // null = present
  responsibilities: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  specialization: string;
  institution: string | null;
  graduationYear: number;
  notes: string | null;
}

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: "code" | "layout" | "server" | "database" | "brain" | "wrench";
  skills: Skill[];
}

export type ProjectStatus = "in-development" | "completed" | "archived";

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  problem: string;
  features: string[];
  stack: string[];
  contribution: string;
  implementation: string[];
  status: ProjectStatus;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  url: string | null;
}

export interface PortfolioContent {
  profile: Profile;
  social: SocialLinks;
  resumeUrl: string | null;
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
}
