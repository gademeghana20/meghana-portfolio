import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPortfolioContent } from "@/lib/content";
import { statusLabel } from "@/components/projects/ProjectCard";
import { GithubIcon } from "@/components/ui/icons";
import { Container, Tag } from "@/components/ui/primitives";

export async function generateStaticParams() {
  const { projects } = await getPortfolioContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { projects } = await getPortfolioContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.shortDescription };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const { projects } = await getPortfolioContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="py-12">
      <Container className="max-w-3xl">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
          <ArrowLeft size={16} aria-hidden="true" /> Back to projects
        </Link>

        <p className="mt-8 font-mono text-xs text-accent">{statusLabel[project.status]}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{project.overview}</p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:border-accent hover:text-accent">
              <GithubIcon className="size-4" /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:border-accent hover:text-accent">
              <ExternalLink size={14} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>

        <Block title="Problem">
          <p>{project.problem}</p>
        </Block>
        <Block title="Key features">
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Block>
        <Block title="Tech stack">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="My contribution">
          <p>{project.contribution}</p>
        </Block>
        <Block title="Implementation">
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            {project.implementation.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Block>
      </Container>
    </main>
  );
}
