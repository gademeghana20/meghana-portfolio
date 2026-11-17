import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project, ProjectStatus } from "@/types/portfolio";
import { GithubIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/primitives";

export const statusLabel: Record<ProjectStatus, string> = {
  "in-development": "In development",
  completed: "Completed",
  archived: "Archived",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/50">
      {project.imageUrl ? (
        <div className="relative h-40 border-b border-border bg-surface-2">
          <Image
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex h-40 items-center justify-center border-b border-border bg-surface-2 font-mono text-sm text-muted"
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
            className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
          >
            View details <ArrowRight size={14} aria-hidden="true" />
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
