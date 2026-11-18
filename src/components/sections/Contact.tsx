import { Mail } from "lucide-react";
import type { SocialLinks } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/utilities/stagger";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Contact({ social }: { social: SocialLinks }) {
  const card =
    "lift flex h-full items-center gap-4 rounded-2xl border border-border bg-surface shadow-card p-5";

  const cards = [
    social.email && (
      <a key="email" href={`mailto:${social.email}`} className={card}>
        <Mail className="text-accent" size={22} aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-xs text-muted">Email</span>
          <span className="block truncate text-sm">{social.email}</span>
        </span>
      </a>
    ),
    social.linkedin && (
      <a key="linkedin" href={social.linkedin} className={card} target="_blank" rel="noopener noreferrer">
        <LinkedinIcon className="size-[22px] text-accent" />
        <span>
          <span className="block text-xs text-muted">LinkedIn</span>
          <span className="block text-sm">Connect with me</span>
        </span>
      </a>
    ),
    social.github && (
      <a key="github" href={social.github} className={card} target="_blank" rel="noopener noreferrer">
        <GithubIcon className="size-[22px] text-accent" />
        <span>
          <span className="block text-xs text-muted">GitHub</span>
          <span className="block text-sm">View my code</span>
        </span>
      </a>
    ),
  ].filter(Boolean);

  return (
    <section id="contact" className="py-16">
      <Container>
        <SectionHeading eyebrow="Contact" title="Let's get in touch" />
        <Reveal>
          <p className="mb-8 max-w-xl text-lg text-muted">
            I&apos;m open to software engineering opportunities and conversations about
            building and AI. The best way to reach me is by email or LinkedIn.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={i} delay={stagger(i)} className="h-full">
              {c}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
