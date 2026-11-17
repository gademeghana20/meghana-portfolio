import type { Project } from "@/types/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-16">
      <Container>
        <SectionHeading eyebrow="Projects" title="Selected projects" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
