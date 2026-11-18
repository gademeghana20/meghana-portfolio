import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project, ProjectStatus } from "@/types/portfolio";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectImage } from "@/components/projects/ProjectImage";
import { Tag } from "@/components/ui/primitives";

export const statusLabel: Record<ProjectStatus, string> = {
  "in-development": "In development",
  completed: "Completed",
  archived: "Archived",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {project.images[0] ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
          <ProjectImage
            image={project.images[0]}
            alt={`${project.title} screenshot`}
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/10] items-center justify-center border-b border-border bg-sage-soft font-mono text-sm text-muted"
        >
          Screenshot coming soon
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs text-accent">{statusLabel[project.status]}</p>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4 pt-2 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="group inline-flex items-center gap-1.5 font-medium text-accent"
          >
            <span className="link-underline">View details</span>
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
              <GithubIcon className="size-4" /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
              <ExternalLink size={14} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
