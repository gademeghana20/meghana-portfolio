import { Mail } from "lucide-react";
import type { SocialLinks } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Contact({ social }: { social: SocialLinks }) {
  const card =
    "flex items-center gap-4 rounded-2xl border border-border bg-surface shadow-card p-5 transition-colors hover:border-accent/50";

  return (
    <section id="contact" className="py-16">
      <Container>
        <SectionHeading eyebrow="Contact" title="Let's get in touch" />
        <p className="mb-8 max-w-xl text-lg text-muted">
          I&apos;m open to software engineering opportunities and conversations about
          building and AI. The best way to reach me is by email or LinkedIn.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {social.email && (
            <a href={`mailto:${social.email}`} className={card}>
              <Mail className="text-accent" size={22} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs text-muted">Email</span>
                <span className="block truncate text-sm">{social.email}</span>
              </span>
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} className={card} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="size-[22px] text-accent" />
              <span>
                <span className="block text-xs text-muted">LinkedIn</span>
                <span className="block text-sm">Connect with me</span>
              </span>
            </a>
          )}
          {social.github && (
            <a href={social.github} className={card} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-[22px] text-accent" />
              <span>
                <span className="block text-xs text-muted">GitHub</span>
                <span className="block text-sm">View my code</span>
              </span>
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
