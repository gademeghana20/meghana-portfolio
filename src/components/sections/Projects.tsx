import type { Project } from "@/types/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/utilities/stagger";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-16">
      <Container>
        <SectionHeading eyebrow="Projects" title="Selected projects" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={stagger(i % 2)} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
