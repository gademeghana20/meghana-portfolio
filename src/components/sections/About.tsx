import type { Profile } from "@/types/portfolio";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="py-16">
      <Container>
        <SectionHeading eyebrow="About" title="A bit about me" />
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {profile.summary.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="border-l-2 border-accent pl-4 text-base text-foreground">
            <span className="text-muted">Career interests: </span>
            {profile.careerInterests}
          </p>
        </div>
      </Container>
    </section>
  );
}
